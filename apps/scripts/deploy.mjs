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
  const prod = args.includes('--prod');
  const sites = filter ? [filter] : SITES;

  for (const site of sites) {
    if (!SITES.includes(site)) {
      console.error(`Unknown site: ${site}. Available: ${SITES.join(', ')}`);
      process.exit(1);
    }
    console.log(`Deploying site: ${site}`);
    const cmd = prod
      ? `vercel deploy --prod --filter @ai-toolkit/${site}`
      : `vercel deploy --filter @ai-toolkit/${site}`;
    run(cmd);
  }

  console.log('All sites deployed successfully.');
}

main();
