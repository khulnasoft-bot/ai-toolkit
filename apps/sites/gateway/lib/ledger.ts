import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { priceUsage } from '@ai-toolkit/observability-cost';
import { loadPrices } from './config';

export interface UsageEntry {
  readonly timestamp: number;
  readonly tenantId: string;
  readonly keyId: string;
  readonly model: string;
  readonly provider: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly cost: number;
  readonly currency: string;
  readonly priced: boolean;
}

/**
 * Append a usage record to `$GATEWAY_DATA_DIR/usage.jsonl`.
 * Best-effort and synchronous: called once per completed stream, never
 * on the streaming hot path.
 */
export function recordUsage(
  entry: Omit<UsageEntry, 'timestamp' | 'cost' | 'currency' | 'priced'> & {
    promptTokens: number;
    completionTokens: number;
  },
): void {
  try {
    const prices = loadPrices();
    const priced = priceUsage(prices, entry.model, {
      promptTokens: entry.promptTokens,
      completionTokens: entry.completionTokens,
    });
    const record: UsageEntry = {
      ...entry,
      timestamp: Date.now(),
      cost: priced.cost,
      currency: priced.currency,
      priced: priced.priced,
    };
    const file = join(process.env.GATEWAY_DATA_DIR ?? './data', 'usage.jsonl');
    mkdirSync(dirname(file), { recursive: true });
    appendFileSync(file, `${JSON.stringify(record)}\n`);
  } catch {
    // ledger writes must never fail the request
  }
}
