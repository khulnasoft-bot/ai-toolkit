import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseJSON } from '@ai-toolkit/provider-utils';
import type { UsageEntry } from './ledger';

export interface UsageFilter {
  readonly keyId?: string;
  readonly tenantId?: string;
  readonly model?: string;
  readonly from?: number;
  readonly to?: number;
}

export interface UsageSummary {
  totalCost: number;
  currency: string;
  requestCount: number;
  promptTokens: number;
  completionTokens: number;
  unpricedCount: number;
  byModel: Record<string, { cost: number; requests: number }>;
  byDay: Record<string, { cost: number; requests: number }>;
}

function isUsageEntry(value: unknown): value is UsageEntry {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.timestamp === 'number' &&
    typeof record.keyId === 'string' &&
    typeof record.tenantId === 'string' &&
    typeof record.model === 'string' &&
    typeof record.cost === 'number'
  );
}

function ledgerFile(): string {
  return join(process.env.GATEWAY_DATA_DIR ?? './data', 'usage.jsonl');
}

/** Read all ledger entries (best-effort; corrupt lines are skipped). */
export async function readUsage(): Promise<UsageEntry[]> {
  let raw: string;
  try {
    raw = readFileSync(ledgerFile(), 'utf-8');
  } catch {
    return [];
  }
  const entries: UsageEntry[] = [];
  for (const line of raw.split('\n')) {
    if (line.trim().length === 0) continue;
    try {
      const value: unknown = await parseJSON({ text: line });
      if (isUsageEntry(value)) entries.push(value);
    } catch {
      // corrupt line — skip
    }
  }
  return entries;
}

function dayOf(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

/** Aggregate ledger entries, optionally filtered. Pure over the entry list. */
export function summarizeUsage(
  entries: readonly UsageEntry[],
  filter: UsageFilter = {},
): UsageSummary {
  const summary: UsageSummary = {
    totalCost: 0,
    currency: 'USD',
    requestCount: 0,
    promptTokens: 0,
    completionTokens: 0,
    unpricedCount: 0,
    byModel: {},
    byDay: {},
  };
  for (const entry of entries) {
    if (filter.keyId !== undefined && entry.keyId !== filter.keyId) continue;
    if (filter.tenantId !== undefined && entry.tenantId !== filter.tenantId)
      continue;
    if (filter.model !== undefined && entry.model !== filter.model) continue;
    if (filter.from !== undefined && entry.timestamp < filter.from) continue;
    if (filter.to !== undefined && entry.timestamp > filter.to) continue;
    summary.totalCost += entry.cost;
    summary.currency = entry.currency;
    summary.requestCount += 1;
    summary.promptTokens += entry.promptTokens;
    summary.completionTokens += entry.completionTokens;
    if (!entry.priced) summary.unpricedCount += 1;
    const model = (summary.byModel[entry.model] ??= { cost: 0, requests: 0 });
    model.cost += entry.cost;
    model.requests += 1;
    const day = (summary.byDay[dayOf(entry.timestamp)] ??= {
      cost: 0,
      requests: 0,
    });
    day.cost += entry.cost;
    day.requests += 1;
  }
  return summary;
}

/**
 * Check a key's accumulated spend against its budget cap.
 * Returns the current spend; callers compare against `budgetCap`.
 * Keys without a cap are unchecked (returns 0-spend semantics via null).
 */
export function spendForKey(
  entries: readonly UsageEntry[],
  keyId: string,
): number {
  return entries.reduce(
    (sum, entry) => (entry.keyId === keyId ? sum + entry.cost : sum),
    0,
  );
}
