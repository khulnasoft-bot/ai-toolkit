import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  loadPriceTable,
  type PriceTable,
} from '@ai-toolkit/observability-cost';
import { validatePolicy, type RoutingPolicy } from '@ai-toolkit/gateway-router';

let policyCache: { mtimeMs: number; policy: RoutingPolicy } | undefined;
let pricesCache: PriceTable | undefined;

function configPath(name: string): string {
  return join(process.cwd(), 'config', name);
}

/**
 * Load and validate the routing policy. Reloads when the file changes on
 * disk so policy edits take effect without a restart.
 */
export function loadPolicy(): RoutingPolicy {
  const path = configPath('policy.json');
  let mtimeMs = 0;
  try {
    mtimeMs = statSync(path).mtimeMs;
  } catch {
    // missing file surfaces below as a read error
  }
  if (!policyCache || policyCache.mtimeMs !== mtimeMs) {
    const raw = readFileSync(path, 'utf-8');
    const policy = JSON.parse(raw) as RoutingPolicy;
    const problems = validatePolicy(policy);
    if (problems.length > 0) {
      throw new Error(`invalid routing policy: ${problems.join('; ')}`);
    }
    policyCache = { mtimeMs, policy };
  }
  return policyCache.policy;
}

/** Load and validate the price table (cached per process). */
export function loadPrices(): PriceTable {
  if (!pricesCache) {
    const raw = readFileSync(configPath('prices.json'), 'utf-8');
    pricesCache = loadPriceTable(JSON.parse(raw));
  }
  return pricesCache;
}
