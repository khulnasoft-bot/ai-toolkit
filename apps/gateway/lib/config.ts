import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  loadPriceTable,
  type PriceTable,
} from '@ai-toolkit/observability-cost';
import { validatePolicy, type RoutingPolicy } from '@ai-toolkit/gateway-router';

let policyCache: RoutingPolicy | undefined;
let pricesCache: PriceTable | undefined;

function configPath(name: string): string {
  return join(process.cwd(), 'config', name);
}

/** Load and validate the routing policy (cached per process). */
export function loadPolicy(): RoutingPolicy {
  if (!policyCache) {
    const raw = readFileSync(configPath('policy.json'), 'utf-8');
    const policy = JSON.parse(raw) as RoutingPolicy;
    const problems = validatePolicy(policy);
    if (problems.length > 0) {
      throw new Error(`invalid routing policy: ${problems.join('; ')}`);
    }
    policyCache = policy;
  }
  return policyCache;
}

/** Load and validate the price table (cached per process). */
export function loadPrices(): PriceTable {
  if (!pricesCache) {
    const raw = readFileSync(configPath('prices.json'), 'utf-8');
    pricesCache = loadPriceTable(JSON.parse(raw));
  }
  return pricesCache;
}
