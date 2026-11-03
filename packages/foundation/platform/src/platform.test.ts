import { describe, expect, it } from 'vitest';
import {
  PlatformRegistry,
  createPlatformApi,
  type PlatformApiRequest,
  type PlatformRegistrySnapshot,
  validateRegistry,
} from './index';

function makeSnapshot(overrides?: Partial<PlatformRegistrySnapshot>): PlatformRegistrySnapshot {
  const base: PlatformRegistrySnapshot = {
    schemaVersion: 1,
    registryVersion: 'test-v1',
    generatedAt: '2026-01-01T00:00:00.000Z',
    records: [
      {
        id: 'provider:openai',
        type: 'provider',
        slug: 'openai',
        name: 'OpenAI',
        description: 'OpenAI provider',
        status: 'active',
        tags: ['chat', 'language'],
        links: [{ label: 'docs', href: 'https://openai.com' }],
        source: { path: 'content/providers/01-ai-toolkit-providers/openai.mdx', kind: 'content' },
        updatedAt: '2026-01-01',
        category: 'ai-toolkit',
        capabilities: [],
      },
      {
        id: 'model:openai/gpt-4o',
        type: 'model',
        slug: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Flagship model',
        status: 'active',
        tags: ['chat'],
        links: [],
        source: { path: 'packages/gateway/core/src/gateway-language-model-settings.ts', kind: 'package-source' },
        updatedAt: '2026-01-01',
        providerId: 'provider:openai',
        providerModelId: 'openai/gpt-4o',
        modality: 'language',
        capabilities: [],
      },
      {
        id: 'gateway:vercel-ai',
        type: 'gateway',
        slug: 'vercel-ai',
        name: 'Vercel AI Gateway',
        description: 'Gateway',
        status: 'active',
        tags: ['gateway'],
        links: [],
        source: { path: 'content/gateways-registry/registry.ts', kind: 'registry' },
        updatedAt: '2026-01-01',
        developer: 'Vercel',
        packageName: '@ai-toolkit/gateway',
        installCommands: { pnpm: 'pnpm add', npm: 'npm add', yarn: 'yarn add', bun: 'bun add' },
        codeExample: 'import { createGateway }',
      },
    ],
    ...overrides,
  };
  return base;
}

describe('validateRegistry', () => {
  it('returns no issues for a valid snapshot', () => {
    const issues = validateRegistry(makeSnapshot());
    expect(issues).toEqual([]);
  });

  it('detects duplicate ids', () => {
    const snapshot = makeSnapshot({
      records: [
        ...makeSnapshot().records,
        { ...makeSnapshot().records[0] },
      ],
    });
    const issues = validateRegistry(snapshot);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe('duplicate-id');
    expect(issues[0].recordId).toBe('provider:openai');
  });

  it('detects invalid id prefix', () => {
    const snapshot = makeSnapshot({
      records: [
        {
          ...makeSnapshot().records[0],
          id: 'openai',
        },
      ],
    });
    const issues = validateRegistry(snapshot);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe('invalid-id');
  });

  it('detects missing provider reference for models', () => {
    const snapshot = makeSnapshot({
      records: [
        {
          id: 'model:unknown/x',
          type: 'model',
          slug: 'x',
          name: 'X',
          description: 'x',
          status: 'active',
          tags: [],
          links: [],
          source: { path: 'src', kind: 'package-source' },
          updatedAt: '2026-01-01',
          providerId: 'provider:missing',
          providerModelId: 'missing/x',
          modality: 'language',
          capabilities: [],
        },
      ],
    });
    const issues = validateRegistry(snapshot);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe('missing-reference');
  });
});

describe('PlatformRegistry', () => {
  const registry = new PlatformRegistry(makeSnapshot());

  it('lists all records sorted by name', () => {
    const records = registry.all();
    expect(records.map(r => r.name)).toEqual(['GPT-4o', 'OpenAI', 'Vercel AI Gateway']);
  });

  it('filters by type', () => {
    const models = registry.all({ type: 'model' });
    expect(models).toHaveLength(1);
    expect(models[0].id).toBe('model:openai/gpt-4o');
  });

  it('limits results', () => {
    const limited = registry.list({ limit: 1 });
    expect(limited).toHaveLength(1);
  });

  it('clamps limit between 1 and MAX', () => {
    const zero = registry.list({ limit: 0 });
    expect(zero).toHaveLength(1);
    const huge = registry.list({ limit: 9999 });
    expect(huge.length).toBeLessThanOrEqual(100);
  });

  it('gets a single record by id', () => {
    const record = registry.get('provider:openai');
    expect(record?.id).toBe('provider:openai');
    expect(record?.type).toBe('provider');
  });

  it('returns undefined for missing id', () => {
    expect(registry.get('provider:nope')).toBeUndefined();
  });

  it('searches by name/description/tags', () => {
    const results = registry.search('openai');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id === 'provider:openai')).toBe(true);
  });

  it('returns empty search for no match', () => {
    expect(registry.search('zzz-nothing')).toEqual([]);
  });
});

describe('createPlatformApi', () => {
  const registry = new PlatformRegistry(makeSnapshot());

  function request(pathname: string, params: Record<string, string> = {}): PlatformApiRequest {
    const url = new URL(`http://localhost${pathname}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return { pathname: url.pathname, searchParams: url.searchParams };
  }

  it('returns 404 for non-platform paths', async () => {
    const handle = createPlatformApi(registry);
    const res = await handle(request('/other'));
    expect(res.status).toBe(404);
  });

  it('serves catalog', async () => {
    const handle = createPlatformApi(registry);
    const res = await handle(request('/api/platform/v1/catalog'));
    expect(res.status).toBe(200);
    const body = res.body as { version: string; records: unknown[] };
    expect(body.version).toBe('test-v1');
    expect(body.records).toHaveLength(3);
  });

  it('serves collection by type', async () => {
    const handle = createPlatformApi(registry);
    const res = await handle(request('/api/platform/v1/catalog/models'));
    expect(res.status).toBe(200);
    const body = res.body as { version: string; records: unknown[] };
    expect(body.records).toHaveLength(1);
  });

  it('serves search', async () => {
    const handle = createPlatformApi(registry);
    const res = await handle(request('/api/platform/v1/search', { q: 'openai' }));
    expect(res.status).toBe(200);
    const body = res.body as { version: string; results: unknown[] };
    expect(body.results.length).toBeGreaterThan(0);
  });

  it('returns 404 for metrics without getMetrics', async () => {
    const handle = createPlatformApi(registry);
    const res = await handle(request('/api/platform/v1/metrics/overview'));
    expect(res.status).toBe(404);
  });

  it('serves metrics with getMetrics', async () => {
    const handle = createPlatformApi(registry, {
      getMetrics: counts => ({ total: counts.providers + counts.models }),
    });
    const res = await handle(request('/api/platform/v1/metrics/overview'));
    expect(res.status).toBe(200);
    const body = res.body as { version: string; metrics: { total: number } };
    expect(body.metrics.total).toBe(4);
  });
});
