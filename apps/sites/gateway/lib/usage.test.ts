import { describe, expect, it } from 'vitest';
import type { UsageEntry } from './ledger';
import { spendForKey, summarizeUsage } from './usage';

function entry(overrides: Partial<UsageEntry> = {}): UsageEntry {
  return {
    timestamp: Date.parse('2026-10-01T10:00:00Z'),
    tenantId: 'acme',
    keyId: 'k1',
    model: 'openai/gpt-4o-mini',
    provider: 'openai',
    promptTokens: 1000,
    completionTokens: 500,
    cost: 0.00045,
    currency: 'USD',
    priced: true,
    ...overrides,
  };
}

describe('summarizeUsage', () => {
  it('aggregates totals, models, and days', () => {
    const summary = summarizeUsage([
      entry(),
      entry({
        model: 'openai/gpt-4o',
        cost: 0.01,
        timestamp: Date.parse('2026-10-02T10:00:00Z'),
      }),
      entry({ keyId: 'k2', cost: 0.02 }),
    ]);
    expect(summary.requestCount).toBe(3);
    expect(summary.totalCost).toBeCloseTo(0.03045, 8);
    expect(summary.promptTokens).toBe(3000);
    expect(summary.byModel['openai/gpt-4o']).toEqual({
      cost: 0.01,
      requests: 1,
    });
    expect(Object.keys(summary.byDay)).toEqual(['2026-10-01', '2026-10-02']);
    expect(summary.unpricedCount).toBe(0);
  });

  it('filters and counts unpriced', () => {
    const summary = summarizeUsage(
      [entry(), entry({ keyId: 'k2', priced: false, cost: 0 })],
      { keyId: 'k2' },
    );
    expect(summary.requestCount).toBe(1);
    expect(summary.unpricedCount).toBe(1);
  });
});

describe('spendForKey', () => {
  it('sums one key only', () => {
    expect(
      spendForKey([entry(), entry({ keyId: 'k2', cost: 1 })], 'k1'),
    ).toBeCloseTo(0.00045, 8);
  });
});
