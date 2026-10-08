import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const SITES = ['docs', 'www', 'studio'];

export const appsDir = join(dirname(fileURLToPath(import.meta.url)), '..');

function binName(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export function buildSites(targets) {
  const bin = join(appsDir, 'node_modules', '.bin');
  for (const site of targets) {
    if (site === 'docs') {
      run(join(bin, binName('fumadocs-mdx')), [], join(appsDir, 'docs'));
    }
    run(join(bin, binName('next')), ['build'], join(appsDir, site));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const requested = process.argv[2];
  const targets = requested ? [requested] : [];
  if (targets.length === 0 || !targets.every(site => SITES.includes(site))) {
    console.error('Usage: build-one.mjs <docs|www|studio>');
    process.exit(2);
  }
  buildSites(targets);
}
