#!/usr/bin/env node

/**
 * Migrates a package from the legacy flat structure to a domain directory.
 *
 * Usage: node tools/scripts/migrate-package.mjs <package-dir-name> [--domain=<domain>] [--dry-run]
 *
 * Moves packages/<name> -> packages/<domain>/<name>
 * Updates:
 *   - git mv the directory
 *   - Root tsconfig.json reference path
 *   - tsconfig.json "extends" path (node_modules -> tools/tsconfig)
 *   - tsconfig.json "references" paths in moved package + all referencing packages
 *   - tsconfig.json "paths" mappings in moved package + all referencing packages
 *   - package.json stability/owners metadata
 *
 * Package npm names stay unchanged; only physical directory changes.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const PACKAGES = path.join(ROOT, 'packages');
const PRUNE = new Set(['node_modules', 'dist', '.git', 'build', '.turbo', 'coverage']);

// Map of package directory name -> target domain
const DOMAIN_MAP = {
  // Core
  ai: 'core',
  'provider-utils': 'core',

  // Validation
  provider: 'validation',
  valibot: 'validation',

  // Providers
  'amazon-bedrock': 'providers',
  anthropic: 'providers',
  assemblyai: 'providers',
  azure: 'providers',
  baseten: 'providers',
  'black-forest-labs': 'providers',
  cerebras: 'providers',
  cohere: 'providers',
  deepgram: 'providers',
  deepinfra: 'providers',
  deepseek: 'providers',
  elevenlabs: 'providers',
  fal: 'providers',
  fireworks: 'providers',
  gladia: 'providers',
  google: 'providers',
  'google-vertex': 'providers',
  groq: 'providers',
  huggingface: 'providers',
  hume: 'providers',
  lmnt: 'providers',
  luma: 'providers',
  mistral: 'providers',
  openai: 'providers',
  'openai-compatible': 'providers',
  perplexity: 'providers',
  prodia: 'providers',
  replicate: 'providers',
  revai: 'providers',
  togetherai: 'providers',
  xai: 'providers',

  // Adapters
  react: 'adapters',
  rsc: 'adapters',
  angular: 'adapters',
  svelte: 'adapters',
  vue: 'adapters',
  langchain: 'adapters',
  llamaindex: 'adapters',

  // UI
  elements: 'ui',

  // Special
  gateway: 'special',
  codemod: 'special',
  devtools: 'special',
  khulnasoft: 'special',

  // MCP
  mcp: 'mcp',

  // Infrastructure
  'test-server': 'infrastructure',
};

const OWNER_MAP = {
  core: '@khulnasoft/ai-toolkit-core',
  providers: '@khulnasoft/ai-toolkit-providers',
  adapters: '@khulnasoft/ai-toolkit-adapters',
  ui: '@khulnasoft/ai-react-team',
  mcp: '@khulnasoft/ai-mcp',
  special: '@khulnasoft/ai-toolkit-core',
  validation: '@khulnasoft/ai-toolkit-core',
  infrastructure: '@khulnasoft/ai-toolkit-infrastructure',
};

const STABILITY_MAP = {
  ai: 'stable',
  'provider-utils': 'stable',
  provider: 'stable',
  valibot: 'stable',
  langchain: 'stable',
  llamaindex: 'stable',
  mcp: 'beta',
  'test-server': 'internal',
  'google-vertex': 'stable',
  openai: 'stable',
  anthropic: 'stable',
  azure: 'stable',
  'amazon-bedrock': 'stable',
  groq: 'stable',
  cohere: 'stable',
  react: 'stable',
  rsc: 'stable',
  elements: 'beta',
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function readAllPackageDirs() {
  const dirs = new Map();

  // Scan flat packages/
  for (const entry of fs.readdirSync(PACKAGES, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules')
      continue;
    const dir = path.join(PACKAGES, entry.name);
    if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
    const manifest = readJson(path.join(dir, 'package.json'));
    if (manifest && manifest.name) {
      dirs.set(entry.name, {
        dir: path.relative(ROOT, dir).split(path.sep).join('/'),
        name: manifest.name,
        domain: 'legacy',
      });
    }
  }

  // Scan domain subdirectories
  const domains = [
    'core',
    'providers',
    'adapters',
    'ui',
    'mcp',
    'special',
    'validation',
    'infrastructure',
  ];
  for (const domain of domains) {
    const domainDir = path.join(PACKAGES, domain);
    if (!fs.existsSync(domainDir)) continue;
    for (const entry of fs.readdirSync(domainDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const dir = path.join(domainDir, entry.name);
      if (fs.existsSync(path.join(dir, 'package.json'))) {
        const manifest = readJson(path.join(dir, 'package.json'));
        if (manifest && manifest.name) {
          dirs.set(entry.name, {
            dir: path.relative(ROOT, dir).split(path.sep).join('/'),
            name: manifest.name,
            domain,
          });
        }
      }

      // Recurse one level deeper (e.g. special/developer-tools/codemod)
      if (entry.isDirectory()) {
        for (const sub of fs.readdirSync(dir, { withFileTypes: true })) {
          if (!sub.isDirectory() || sub.name.startsWith('.')) continue;
          const subDir = path.join(dir, sub.name);
          if (fs.existsSync(path.join(subDir, 'package.json'))) {
            const manifest = readJson(path.join(subDir, 'package.json'));
            if (manifest && manifest.name) {
              dirs.set(sub.name, {
                dir: path.relative(ROOT, subDir).split(path.sep).join('/'),
                name: manifest.name,
                domain: 'special',
              });
            }
          }
        }
      }
    }
  }

  return dirs;
}

function updateExtendsPath(tsconfig, pkgDirRel) {
  if (!tsconfig.extends || !tsconfig.extends.startsWith('./node_modules/@khulnasoft/ai-tsconfig/'))
    return false;
  const oldExtends = tsconfig.extends;
  const depth = pkgDirRel.split('/').length;
  const prefix = '../'.repeat(depth);
  tsconfig.extends = prefix + 'tools/tsconfig/' + oldExtends.split('@khulnasoft/ai-tsconfig/')[1];
  return oldExtends !== tsconfig.extends;
}

function resolveRefDir(refPath, fromDir) {
  return path.basename(path.resolve(ROOT, fromDir, refPath));
}

function updateReferences(tsconfig, fromDir, pkgName, allDirs, newPkgDirRel) {
  let changed = false;

  // Update "references" array
  if (tsconfig.references) {
    for (const ref of tsconfig.references) {
      // Resolve what package this reference points to
      const refDirName = resolveRefDir(ref.path, fromDir);
      // Check if this reference points to the package being migrated
      if (refDirName === pkgName) {
        const relPath = path.relative(fromDir, newPkgDirRel);
        ref.path = relPath.startsWith('.') ? relPath : './' + relPath;
        changed = true;
      } else {
        // Check if this reference points to a package that has ALREADY been migrated
        const refPkg = allDirs.get(refDirName);
        if (refPkg && refPkg.domain !== 'legacy') {
          const relPath = path.relative(fromDir, refPkg.dir);
          ref.path = relPath.startsWith('.') ? relPath : './' + relPath;
          changed = true;
        }
      }
    }
  }

  // Update "paths" mappings
  if (tsconfig.compilerOptions?.paths) {
    for (const key of Object.keys(tsconfig.compilerOptions.paths)) {
      const newPaths = tsconfig.compilerOptions.paths[key].map(p => {
        const refDirName = resolveRefDir(p, fromDir);
        if (refDirName === pkgName) {
          const relPath = path.relative(fromDir, newPkgDirRel);
          return relPath.startsWith('.') ? relPath : './' + relPath;
        }
        return p;
      });
      if (newPaths.some((p, i) => p !== tsconfig.compilerOptions.paths[key][i])) {
        tsconfig.compilerOptions.paths[key] = newPaths;
        changed = true;
      }
    }
  }

  return changed;
}

function findReferencingTsconfigs(pkgName, allDirs) {
  const referencing = [];
  for (const [dirName, info] of allDirs) {
    const tsconfigPath = path.join(ROOT, info.dir, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) continue;
    const tsconfig = readJson(tsconfigPath);
    if (!tsconfig) continue;

    let found = false;

    if (tsconfig.references) {
      for (const ref of tsconfig.references) {
        if (resolveRefDir(ref.path, info.dir) === pkgName) {
          found = true;
          break;
        }
      }
    }

    if (!found && tsconfig.compilerOptions?.paths) {
      for (const arr of Object.values(tsconfig.compilerOptions.paths)) {
        for (const p of arr) {
          if (resolveRefDir(p, info.dir) === pkgName) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (found) {
      referencing.push({ tsconfigPath, dir: info.dir, tsconfig });
    }
  }
  return referencing;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const explicitPkg = args.find(a => !a.startsWith('--'));
  const pkgName = explicitPkg;

  const domainArg = args.find(a => a.startsWith('--domain='));
  const targetDomain = domainArg ? domainArg.split('=')[1] : pkgName ? DOMAIN_MAP[pkgName] : null;

  if (!pkgName) {
    console.error(
      'Usage: node tools/scripts/migrate-package.mjs <package-dir-name> [--domain=<domain>] [--dry-run]',
    );
    console.error('Known packages:', Object.keys(DOMAIN_MAP).join(', '));
    process.exit(1);
  }

  if (!targetDomain) {
    console.error(`Unknown package: "${pkgName}". Specify --domain=<domain> explicitly.`);
    process.exit(1);
  }

  const allDirs = readAllPackageDirs();
  const pkg = allDirs.get(pkgName);

  if (!pkg) {
    console.error(`Package "${pkgName}" not found in packages/`);
    process.exit(1);
  }

  if (pkg.domain !== 'legacy') {
    console.log(`Package "${pkgName}" is already in domain "${pkg.domain}" (${pkg.dir})`);
    process.exit(0);
  }

  const oldRel = pkg.dir;
  const newRel = `packages/${targetDomain}/${pkgName}`;

  console.log(`\nMigrating: ${oldRel} -> ${newRel}\n`);

  // Step 1: Move the directory
  if (!dryRun) {
    fs.mkdirSync(path.dirname(path.join(ROOT, newRel)), { recursive: true });
    execSync(`git mv "${pkg.dir}" "${newRel}"`, { cwd: ROOT, stdio: 'pipe' });
    console.log('  Moved directory');
  } else {
    console.log('  [DRY RUN] Would move: ' + oldRel + ' -> ' + newRel);
  }

  const movedPkgDirRel = newRel;

  // Step 2: Update the moved package's tsconfig.json
  const movedTsconfigPath = path.join(ROOT, newRel, 'tsconfig.json');
  if (fs.existsSync(movedTsconfigPath)) {
    const tsconfig = readJson(movedTsconfigPath);
    if (tsconfig) {
      const original = JSON.parse(JSON.stringify(tsconfig));

      const logChanges = (oldVal, newVal, label) => {
        if (oldVal !== newVal) console.log(`    ${label}: ${oldVal} -> ${newVal}`);
      };

      // Update extends path
      const oldExtends = tsconfig.extends;
      updateExtendsPath(tsconfig, newRel);
      logChanges(oldExtends, tsconfig.extends || oldExtends, 'extends');

      // Update references
      updateReferences(tsconfig, newRel, pkgName, allDirs, movedPkgDirRel);

      if (JSON.stringify(tsconfig) !== JSON.stringify(original)) {
        if (!dryRun) writeJson(movedTsconfigPath, tsconfig);
        console.log('  Updated tsconfig.json in moved package');
      }
    }
  }

  // Step 3: Update root tsconfig.json reference
  const rootTsconfigPath = path.join(ROOT, 'tsconfig.json');
  if (fs.existsSync(rootTsconfigPath)) {
    const rootTsconfig = readJson(rootTsconfigPath);
    if (rootTsconfig && rootTsconfig.references) {
      let changed = false;
      for (const ref of rootTsconfig.references) {
        if (ref.path === oldRel) {
          ref.path = newRel;
          changed = true;
        }
      }
      if (changed) {
        if (!dryRun) writeJson(rootTsconfigPath, rootTsconfig);
        console.log('  Updated root tsconfig.json reference');
      }
    }
  }

  // Step 4: Update ALL packages that reference this package
  const referencing = findReferencingTsconfigs(pkgName, allDirs);
  if (referencing.length > 0) {
    console.log('  Found ' + referencing.length + ' package(s) referencing "' + pkgName + '"');
    for (const { tsconfigPath, dir, tsconfig } of referencing) {
      // Skip the moved package itself
      if (dir === newRel) continue;

      const original = JSON.parse(JSON.stringify(tsconfig));
      updateReferences(tsconfig, dir, pkgName, allDirs, newRel);

      if (JSON.stringify(tsconfig) !== JSON.stringify(original)) {
        if (!dryRun) writeJson(tsconfigPath, tsconfig);
        console.log('  Updated ' + path.relative(ROOT, tsconfigPath));
      }
    }
  } else {
    console.log('  No referencing packages found');
  }

  // Step 5: Update package.json metadata
  const movedPkgJson = path.join(ROOT, newRel, 'package.json');
  if (fs.existsSync(movedPkgJson)) {
    const manifest = readJson(movedPkgJson);
    if (manifest) {
      let changed = false;

      if (!manifest.stability) {
        manifest.stability = STABILITY_MAP[pkgName] || 'beta';
        changed = true;
      }
      if (!manifest.owners) {
        manifest.owners = [OWNER_MAP[targetDomain] || '@khulnasoft/ai-toolkit-maintainers'];
        changed = true;
      }

      if (changed && !dryRun) {
        writeJson(movedPkgJson, manifest);
        console.log('  Updated package.json metadata');
      }
    }
  }

  // Step 6: Report scripts with potential relative paths
  if (fs.existsSync(movedPkgJson)) {
    const manifest = readJson(movedPkgJson);
    if (manifest && manifest.scripts) {
      const pathScripts = {};
      for (const [name, script] of Object.entries(manifest.scripts)) {
        if (
          typeof script === 'string' &&
          (script.includes('../../content/') || script.includes('../content/'))
        ) {
          pathScripts[name] = script;
        }
      }
      if (Object.keys(pathScripts).length > 0) {
        console.log('  Scripts with potential relative paths (manual review needed):');
        for (const [name, script] of Object.entries(pathScripts)) {
          console.log('    ' + name + ': ' + script);
        }
      }
    }
  }

  console.log('\n  Next: run "pnpm type-check" and "pnpm build" to verify.');
  if (dryRun) console.log('  [DRY RUN] No changes were made.');
}

main();
