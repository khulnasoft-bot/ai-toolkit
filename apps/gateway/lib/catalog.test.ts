import { describe, expect, it } from 'vitest';
import type { PriceTable } from '@ai-toolkit/observability-cost';
import type { RoutingPolicy } from '@ai-toolkit/gateway-router';
import { loadCatalog, type RegistryModel } from './catalog';

const policy: RoutingPolicy = {
  version: 1,
  routes: [
    {
      modelPattern: 'openai/gpt-4o-mini',
      providers: [{ provider: 'openai', model: 'gpt-4o-mini' }],
      strategy: 'ordered',
      retryBudget: 2,
    },
  ],
  fallback: { provider: 'openai', model: 'gpt-4o-mini' },
};

const prices: PriceTable = {
  version: 1,
  currency: 'USD',
  entries: [
    {
      modelPattern: 'openai/*',
      inputPer1k: 0.15,
      outputPer1k: 0.6,
      currency: 'USD',
    },
  ],
};

const registry: RegistryModel[] = [
  {
    id: 'openai/gpt-4o-mini',
    type: 'chat',
    context: '128K',
    tags: ['tool-use'],
    description: 'Fast OpenAI chat model.',
  },
];

describe('loadCatalog', () => {
  it('merges registry, policy, and prices', () => {
    const [entry] = loadCatalog(registry, policy, prices);
    expect(entry).toMatchObject({
      id: 'openai/gpt-4o-mini',
      type: 'chat',
      context: '128K',
      strategy: 'ordered',
      retryBudget: 2,
      routedViaFallback: false,
      price: { inputPer1M: 150, outputPer1M: 600, currency: 'USD' },
    });
    expect(entry.providers).toEqual([
      { provider: 'openai', model: 'gpt-4o-mini' },
    ]);
  });

  it('marks unpriced models with null price', () => {
    const [entry] = loadCatalog(registry, policy, { ...prices, entries: [] });
    expect(entry.price).toBeNull();
  });

  it('throws for registry models with no route', () => {
    const noRoute: RoutingPolicy = { version: 1, routes: [] };
    expect(() => loadCatalog(registry, noRoute, prices)).toThrow(
      'matches no policy route',
    );
  });

  it('loads the real registry with valid entries', async () => {
    const { loadRegistry } = await import('./catalog');
    const models = loadRegistry();
    expect(models.length).toBeGreaterThan(0);
    for (const model of models) {
      expect(model.id).toMatch(/^[^/]+\/[^/]+$/);
      expect(model.description.length).toBeGreaterThan(0);
    }
  });

  it('merges the real config without gaps', async () => {
    const { loadCatalog: loadRealCatalog } = await import('./catalog');
    const entries = loadRealCatalog();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.providers.length).toBeGreaterThan(0);
      expect(entry.price).not.toBeNull();
      expect(entry.routedViaFallback).toBe(false);
    }
  });
});
