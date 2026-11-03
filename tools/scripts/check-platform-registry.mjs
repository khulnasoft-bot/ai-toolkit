import { execSync } from 'child_process';
import { readFileSync } from 'node:fs';

const REGISTRY_PATH = 'build/platform-registry.json';

function main() {
  console.log('Checking platform registry snapshot freshness...');

  const before = readFileSync(REGISTRY_PATH, 'utf8');

  try {
    execSync('pnpm --filter @ai-toolkit/platform generate-registry', {
      stdio: 'pipe',
    });
  } catch (error) {
    console.error('Failed to regenerate platform registry:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const after = readFileSync(REGISTRY_PATH, 'utf8');

  if (before !== after) {
    console.error(
      'Platform registry snapshot is stale. Run `pnpm --filter @ai-toolkit/platform generate-registry` and commit the updated build/platform-registry.json.',
    );
    process.exit(1);
  }

  console.log('Platform registry snapshot is fresh.');
}

main();
