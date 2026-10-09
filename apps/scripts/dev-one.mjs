import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITES } from './build-one.mjs';

const appsDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const binDir = join(appsDir, 'node_modules', '.bin');
const binName = process.platform === 'win32' ? 'next.cmd' : 'next';

const site = process.argv[2];
if (!SITES.includes(site)) {
  console.error('Usage: dev-one.mjs <docs|www|studio>');
  process.exit(2);
}

const port = Number(process.env.PORT) || 3000;

const child = spawn(join(binDir, binName), ['dev', '-p', String(port)], {
  cwd: join(appsDir, site),
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', code => process.exit(code ?? 1));
