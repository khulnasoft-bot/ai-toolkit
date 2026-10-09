#!/usr/bin/env node

/**
 * CLI tool to find packages, providers, and their ownership.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const PACKAGES = path.join(ROOT, 'packages');

const args = process.argv.slice(2);

if (args.includes('--list') || args.includes('-l')) {
  listPackages();
} else if (args.includes('--owner') || args.includes('-o')) {
  showOwnership(args.filter(a => !a.startsWith('--')));
} else if (args.length > 0) {
  searchPackages(args[0]);
} else {
  showHelp();
}

function showHelp() {
  console.log(`
Usage:
  pnpm find-package <query>       Search for a package by name
  pnpm find-package --owner <pkg> Show ownership info
  pnpm find-package --list        List all packages by domain
`);
}

function listPackages() {
  const domains = [
    'core',
    'providers',
    'adapters',
    'mcp',
    'special',
    'validation',
    'infrastructure',
  ];
  const entries = fs.readdirSync(PACKAGES);
  const domainSet = new Set(domains);

  console.log('\n📦 Packages by Domain\n');

  for (const domain of domains) {
    const dir = path.join(PACKAGES, domain);
    if (!fs.existsSync(dir)) continue;
    const packages = fs
      .readdirSync(dir)
      .filter(e => fs.statSync(path.join(dir, e)).isDirectory() && !e.startsWith('.'));
    if (packages.length > 0) {
      console.log(`  ${domain}/`);
      packages.forEach(p => {
        console.log(`    └── ${p}`);
      });
      console.log('');
    }
  }

  const unorganized = entries.filter(
    e =>
      !domainSet.has(e) && fs.statSync(path.join(PACKAGES, e)).isDirectory() && !e.startsWith('.'),
  );

  if (unorganized.length > 0) {
    console.log('  (unorganized — not yet migrated)');
    unorganized.forEach(p => {
      console.log(`    └── ${p}`);
    });
    console.log('');
  }
}

function searchPackages(query) {
  const results = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory() && !entry.startsWith('.')) {
        if (entry.includes(query.toLowerCase())) {
          const pkgJson = path.join(full, 'package.json');
          let name = 'unknown';
          if (fs.existsSync(pkgJson)) {
            try {
              name = JSON.parse(fs.readFileSync(pkgJson, 'utf8')).name;
            } catch {}
          }
          results.push({ path: path.relative(ROOT, full), name });
        }
        if (!full.includes('node_modules')) {
          walk(full);
        }
      }
    }
  }

  walk(PACKAGES);

  if (results.length === 0) {
    console.log(`No packages found matching "${query}"`);
    return;
  }

  console.log(`\n🔍 Packages matching "${query}":\n`);
  results.forEach(r => {
    console.log(`  ${r.name} → ${r.path}`);
  });
  console.log('');
}

function showOwnership(packages) {
  const codeowners = path.join(ROOT, 'CODEOWNERS');
  if (!fs.existsSync(codeowners)) {
    console.error('CODEOWNERS file not found');
    return;
  }

  const content = fs.readFileSync(codeowners, 'utf8');
  const query = packages[0];

  if (query) {
    const lines = content.split('\n').filter(l => l.includes(query));
    if (lines.length > 0) {
      console.log(`\n📋 Ownership for "${query}":\n`);
      lines.forEach(l => {
        console.log(`  ${l.trim()}`);
      });
      console.log('');
    } else {
      console.log(`No ownership info found for "${query}"`);
    }
  } else {
    console.log(content);
  }
}
