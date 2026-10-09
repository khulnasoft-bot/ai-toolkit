import { describe, expect, it } from 'vitest';
import { loadPriceTable, priceUsage, type PriceTable } from './pricing';

const table: PriceTable = {
  version: 1,
  currency: 'USD',
  entries: [
    {
      modelPattern: 'openai/gpt-4o',
      inputPer1k: 2.5,
      outputPer1k: 10,
      currency: 'USD',
    },
    {
      modelPattern: 'anthropic/*',
      inputPer1k: 3,
      outputPer1k: 15,
      currency: 'USD',
    },
  ],
};

describe('priceUsage', () => {
  it('prices exact and wildcard matches', () => {
    expect(
      priceUsage(table, 'openai/gpt-4o', {
        promptTokens: 1000,
        completionTokens: 500,
      }),
    ).toEqual({ cost: 2.5 + 5, currency: 'USD', priced: true });
    expect(
      priceUsage(table, 'anthropic/claude-3-7-sonnet', {
        promptTokens: 2000,
        completionTokens: 0,
      }),
    ).toEqual({ cost: 6, currency: 'USD', priced: true });
  });

  it('flags unpriced models instead of hiding them', () => {
    expect(
      priceUsage(table, 'unknown/model', {
        promptTokens: 1000,
        completionTokens: 1000,
      }),
    ).toEqual({ cost: 0, currency: 'USD', priced: false });
  });
});

describe('loadPriceTable', () => {
  it('loads a valid document', () => {
    expect(loadPriceTable(JSON.parse(JSON.stringify(table)))).toEqual(table);
  });

  it('rejects malformed documents', () => {
    expect(() => loadPriceTable(null)).toThrow('must be a JSON object');
    expect(() => loadPriceTable({ ...table, version: '1' })).toThrow(
      '"version"',
    );
    expect(() => loadPriceTable({ ...table, entries: {} })).toThrow(
      '"entries"',
    );
    expect(() =>
      loadPriceTable({
        ...table,
        entries: [
          {
            modelPattern: 'x',
            inputPer1k: -1,
            outputPer1k: 0,
            currency: 'USD',
          },
        ],
      }),
    ).toThrow('"inputPer1k"');
  });
});
