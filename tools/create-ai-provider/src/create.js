import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { getArchetype, getAllArchetypes } from './templates/index.js';
import { toPascalCase, toCamelCase, toEnvPrefix } from './templates/common.js';
import { ui, logger, chalk } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// src/ -> tool root -> tools/ -> repo root
export const TOOL_ROOT = path.resolve(__dirname, '..');
export const REPO_ROOT = path.resolve(TOOL_ROOT, '..', '..');

function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function promptForChoice(rl, label, choices, defaultChoice) {
  ui.prompt(label);
  choices.forEach(c => {
    const isDefault = c.name === defaultChoice;
    if (isDefault) {
      ui.promptSelected(`${c.description} (${c.name})`);
    } else {
      ui.promptUnselected(`${c.description} (${c.name})`);
    }
  });

  while (true) {
    const answer = await askQuestion(
      rl,
      chalk.dim('│') + '  ' + 'Type a number or name to select: ',
    );
    const trimmed = answer.trim().toLowerCase();

    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num >= 1 && num <= choices.length) {
      return choices[num - 1].name;
    }

    const match = choices.find(c => c.name === trimmed);
    if (match) return match.name;

    if (!trimmed) return defaultChoice;

    ui.log(chalk.yellow('Invalid selection.'));
  }
}

export function buildContext({ name, archetype, models, executable }) {
  return {
    name,
    archetype,
    pascalName: toPascalCase(name),
    camelName: toCamelCase(name),
    envPrefix: toEnvPrefix(name),
    models,
    executable,
  };
}

export function emitFiles(targetDir, files) {
  for (const file of files) {
    const full = path.join(targetDir, file.path);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, file.content);
  }
}

function addRootTsconfigReference(packageDirName) {
  const tsconfigPath = path.join(REPO_ROOT, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const entry = { path: `packages/providers/${packageDirName}` };
  if (!tsconfig.references.some(r => r.path === entry.path)) {
    // Keep provider entries grouped: insert after harness entries when
    // present, otherwise append before the adapters section.
    const idx = tsconfig.references.findIndex(
      r => r.path === 'packages/providers/harness-pi',
    );
    if (idx !== -1) tsconfig.references.splice(idx + 1, 0, entry);
    else tsconfig.references.push(entry);
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
    return true;
  }
  return false;
}

async function runCommand(cmd, cwd) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  return promisify(exec)(cmd, { cwd });
}

function nextDocNumber() {
  const dir = path.join(REPO_ROOT, 'content/providers/01-ai-toolkit-providers');
  let max = 0;
  for (const file of fs.readdirSync(dir)) {
    const match = file.match(/^(\d+)-/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return max + 10;
}

export function emitDocsStub(ctx) {
  const num = nextDocNumber();
  const title = `${ctx.pascalName} Provider`;
  const canonical = `---
title: ${ctx.pascalName}
description: TODO: describe the ${ctx.name} provider.
---

# ${title}

TODO: document the \`@ai-toolkit/${ctx.name}\` provider.

## Setup

\`\`\`bash
npm i @ai-toolkit/${ctx.name}
\`\`\`
`;
  const siteDir = path.join(
    REPO_ROOT,
    'apps/docs/content/providers/ai-toolkit-providers',
  );
  const canonPath = path.join(
    REPO_ROOT,
    `content/providers/01-ai-toolkit-providers/${num}-${ctx.name}.mdx`,
  );
  const sitePath = path.join(siteDir, `${ctx.name}.mdx`);
  fs.writeFileSync(canonPath, canonical);
  // Site mirror: numeric prefix stripped, H1 dropped (title from frontmatter).
  fs.writeFileSync(sitePath, canonical.replace(`# ${title}\n\n`, ''));
  const metaPath = path.join(siteDir, 'meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  if (!meta.pages.includes(ctx.name)) {
    meta.pages.push(ctx.name);
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  }
  return { canonPath, sitePath };
}

export function emitExampleStub(ctx) {
  const dir = path.join(REPO_ROOT, 'examples/04-tools', ctx.name);
  const exampleJson = {
    name: ctx.name,
    title: ctx.pascalName,
    category: '04-tools',
    categoryOrder: 4,
    framework: 'node',
    primaryProvider: ctx.name,
    description: `TODO: describe the ${ctx.name} example.`,
    tags: [ctx.name],
  };
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'example.json'),
    JSON.stringify(exampleJson, null, 2) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: `@example/${ctx.name}`,
        version: '0.0.0',
        private: true,
        type: 'module',
        scripts: { 'type-check': 'tsc --build' },
        dependencies: { [`@ai-toolkit/${ctx.name}`]: 'workspace:*' },
        devDependencies: { '@types/node': '20.17.24', typescript: '5.8.3' },
      },
      null,
      2,
    ) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: 'es2022',
          lib: ['es2022'],
          module: 'esnext',
          types: ['node'],
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: 'Bundler',
          rootDir: './src',
          outDir: './build',
          skipLibCheck: true,
          composite: true,
        },
        include: ['src/**/*.ts'],
        references: [{ path: `../../../packages/providers/${ctx.name}` }],
      },
      null,
      2,
    ) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'src', 'index.ts'),
    `// TODO: demonstrate @ai-toolkit/${ctx.name}\n`,
  );
  return dir;
}

export async function createProviderPackage(options) {
  let {
    name,
    archetype,
    models,
    executable,
    withDocs = false,
    withExample = false,
    install = true,
    interactive = true,
    repoRoot = REPO_ROOT,
  } = options;

  const targetDir = path.join(repoRoot, 'packages/providers', name);
  if (fs.existsSync(targetDir)) {
    throw new Error(
      `Provider "${name}" already exists at packages/providers/${name}`,
    );
  }

  ui.boxStart('create-ai-provider');

  if (interactive) {
    const rl = createPrompt();
    try {
      if (!archetype) {
        archetype = await promptForChoice(
          rl,
          'Select a provider archetype',
          getAllArchetypes(),
          'openai-compatible',
        );
      }
      if (archetype === 'openai-compatible' && !models) {
        const answer = await askQuestion(
          rl,
          chalk.dim('│') +
            '  ' +
            'Model ids (comma-separated, blank for placeholder): ',
        );
        models = answer
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      if (archetype === 'harness-acp' && !executable) {
        const answer = await askQuestion(
          rl,
          chalk.dim('│') + '  ' + 'Agent command (e.g. "my-agent --acp"): ',
        );
        executable = answer.trim() || undefined;
      }
    } finally {
      rl.close();
    }
  }

  const template = getArchetype(archetype);
  const ctx = buildContext({ name, archetype, models, executable });

  ui.log(
    `Scaffolding ${chalk.bold(template.description)} provider: ${chalk.cyan(`@ai-toolkit/${name}`)}`,
  );
  ui.divider();

  fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });
  emitFiles(targetDir, template.getFiles(ctx));
  ui.success(`Created package at packages/providers/${name}`);

  if (repoRoot === REPO_ROOT) {
    // Normalize formatting (line wrapping depends on the package name
    // length, so templates can't be prettier-clean for every name).
    try {
      await runCommand(
        `pnpm --silent prettier --write "${targetDir}"`,
        REPO_ROOT,
      );
    } catch {
      logger.warn('Could not format scaffolded files automatically');
    }
  }

  if (repoRoot === REPO_ROOT) {
    if (addRootTsconfigReference(name)) {
      ui.success('Added root tsconfig.json reference');
    }
  }

  if (withDocs && repoRoot === REPO_ROOT) {
    const { canonPath } = emitDocsStub(ctx);
    ui.success(`Created docs stub at ${path.relative(REPO_ROOT, canonPath)}`);
  }

  if (withExample && repoRoot === REPO_ROOT) {
    const dir = emitExampleStub(ctx);
    ui.success(`Created example stub at ${path.relative(REPO_ROOT, dir)}`);
    ui.warn('Register it in examples/registry.json before validating');
  }

  if (install && repoRoot === REPO_ROOT) {
    ui.log('Installing dependencies...');
    try {
      await runCommand('pnpm install --prefer-offline', REPO_ROOT);
    } catch {
      logger.warn('Could not install dependencies automatically');
    }
    try {
      await runCommand('pnpm update-references', REPO_ROOT);
    } catch {
      logger.warn('Could not update TypeScript references automatically');
    }
  }

  ui.boxEnd();
  ui.log('');
  ui.log('Next steps:');
  ui.log(`  ${chalk.cyan(`pnpm --filter @ai-toolkit/${name} build`)}`);
  ui.log(`  ${chalk.cyan(`pnpm --filter @ai-toolkit/${name} test`)}`);
  ui.log('  Add a changeset (major), docs, and an example, then');
  ui.log(`  ${chalk.cyan('node tools/scripts/validate-structure.mjs')}`);

  return { targetDir, ctx };
}
