#!/usr/bin/env node

/**
 * Captures the baseline report into build/baseline-<date>/.
 *
 * Runs: inventory, health-check, validate-structure, types:check,
 * focused builds, and package tests. Each command's output is written
 * to a log file; the summary is printed to stdout and stored as report.json.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const OUT_DIR = path.join(ROOT, 'build', `baseline-${STAMP}`);

const COMMANDS = [
  ['inventory', 'node tools/scripts/inventory.mjs'],
  ['health-check', 'pnpm health-check'],
  ['validate-structure', 'pnpm validate-structure'],
  ['types:check', 'pnpm types:check'],
  ['build:runtime', 'pnpm build --filter=@ai-toolkit/runtime --filter=@ai-toolkit/capabilities'],
  ['test:runtime', 'pnpm test --filter=@ai-toolkit/runtime'],
];

const results = [];

function run(label, command) {
  const started = Date.now();
  const log = path.join(OUT_DIR, `${label}.log`);
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
      timeout: 10 * 60 * 1000,
    });
    fs.writeFileSync(log, output);
    results.push({ label, status: 'ok', durationMs: Date.now() - started });
    console.log(`  ✅ ${label} (${Date.now() - started}ms)`);
  } catch (error) {
    fs.writeFileSync(
      log,
      `${String(error.stdout ?? '')}\n${String(error.stderr ?? error.message)}`,
    );
    results.push({
      label,
      status: 'failed',
      durationMs: Date.now() - started,
      code: error.code ?? null,
    });
    console.log(`  ❌ ${label} (${Date.now() - started}ms)`);
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('\nBaseline Report Capture\n');
console.log(`Target: ${path.relative(ROOT, OUT_DIR)}\n`);

for (const [label, command] of COMMANDS) run(label, command);

const failed = results.filter(r => r.status === 'failed').length;
fs.writeFileSync(
  path.join(OUT_DIR, 'report.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), summary: results }, null, 2),
);

console.log(`\nBaseline: ${results.length - failed}/${results.length} checks passed`);
console.log(`Report written to ${path.relative(ROOT, OUT_DIR)}/report.json`);

if (failed > 0) process.exit(1);
