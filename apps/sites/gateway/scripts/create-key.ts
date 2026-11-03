/**
 * Create a gateway API key. The secret is printed once and never stored.
 *
 * Usage:
 *   pnpm keys:create --tenant acme [--scopes gateway:chat] [--budget 25] [--expires-days 90]
 */

import { createApiKey } from '@ai-toolkit/security-auth';
import { FileKeyStore } from '../lib/keys';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const tenant = arg('tenant');
  if (!tenant) {
    console.error('missing required --tenant <id>');
    process.exit(1);
  }
  const scopes = arg('scopes')
    ?.split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const budget = arg('budget') ? Number(arg('budget')) : undefined;
  const expiresDays = arg('expires-days')
    ? Number(arg('expires-days'))
    : undefined;
  if (budget !== undefined && !(budget > 0)) {
    console.error('--budget must be a number > 0');
    process.exit(1);
  }

  const { record, secret } = createApiKey({
    tenantId: tenant,
    scopes,
    budgetCap: budget,
    expiresAt: expiresDays
      ? Date.now() + expiresDays * 24 * 60 * 60 * 1000
      : undefined,
  });
  await new FileKeyStore().save(record);

  console.log(`key id:    ${record.id}`);
  console.log(`tenant:    ${record.tenantId}`);
  console.log(`secret:    ${secret}`);
  console.log('Store the secret now — it cannot be shown again.');
}

void main();
