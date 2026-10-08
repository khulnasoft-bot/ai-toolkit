#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
let allOk = true;

function check(label, fn) {
  try {
    fn();
    console.log(`  ✅ ${label}`);
  } catch (e) {
    console.log(`  ❌ ${label} — ${e.message}`);
    allOk = false;
  }
}

function hasCommand(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getPnpmVersion() {
  try {
    return execSync('pnpm --version', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getNodeVersion() {
  return process.version;
}

console.log('\n🔍 AI TOOLKIT Health Check\n');

console.log('Environment:');
console.log(`  Node: ${getNodeVersion()}`);
const pnpmVer = getPnpmVersion();
console.log(`  pnpm: ${pnpmVer || 'not found'}`);
console.log('');

check('pnpm is installed', () => {
  if (!hasCommand('pnpm')) throw new Error('pnpm not found in PATH');
});

check('Node.js >= 18', () => {
  const major = parseInt(process.version.slice(1).split('.')[0], 10);
  if (major < 18) throw new Error(`Node ${process.version} is too old`);
});

check('turbo is installed', () => {
  try {
    execSync('pnpm exec turbo --version', { stdio: 'pipe' });
  } catch {
    throw new Error('turbo not available via pnpm exec');
  }
});

check('Root package.json exists', () => {
  if (!fs.existsSync(path.join(ROOT, 'package.json'))) throw new Error('package.json not found');
});

check('pnpm-workspace.yaml exists', () => {
  if (!fs.existsSync(path.join(ROOT, 'pnpm-workspace.yaml')))
    throw new Error('pnpm-workspace.yaml not found');
});

check('turbo.json exists', () => {
  if (!fs.existsSync(path.join(ROOT, 'turbo.json'))) throw new Error('turbo.json not found');
});

check('CODEOWNERS exists', () => {
  if (!fs.existsSync(path.join(ROOT, 'CODEOWNERS'))) throw new Error('CODEOWNERS not found');
});

check('Domain directories exist', () => {
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
  const missing = domains.filter(d => !fs.existsSync(path.join(ROOT, 'packages', d)));
  if (missing.length > 0) throw new Error(`Missing: packages/${missing.join(', packages/')}`);
});

console.log('');

if (allOk) {
  console.log('✅ All checks passed!\n');
} else {
  console.log('❌ Some checks failed. Fix the issues above.\n');
  process.exit(1);
}
