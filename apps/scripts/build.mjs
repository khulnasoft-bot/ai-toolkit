import { execSync } from 'child_process';

const SITES = ['www', 'gateway', 'docs'];

function run(command, options = {}) {
  return execSync(command, {
    stdio: 'inherit',
    cwd: process.cwd(),
    ...options,
  });
}

function main() {
  const args = process.argv.slice(2);
  const filter = args.find(a => a.startsWith('--filter='))?.split('=')[1];
  const sites = filter ? [filter] : SITES;

  for (const site of sites) {
    if (!SITES.includes(site)) {
      console.error(`Unknown site: ${site}. Available: ${SITES.join(', ')}`);
      process.exit(1);
    }
    console.log(`Building site: ${site}`);
    run(`pnpm --filter @ai-toolkit/${site} build`);
  }

  console.log('All sites built successfully.');
}

main();
