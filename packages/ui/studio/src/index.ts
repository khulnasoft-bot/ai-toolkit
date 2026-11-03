import {
  PlatformRegistry,
  createPlatformApi,
  type PlatformRegistrySnapshot,
} from '@ai-toolkit/platform';
import { createMemoryManager, type MemoryEntry } from '@ai-toolkit/memory';
import { createContextStore } from '@ai-toolkit/context';

export type StudioConfig = {
  readonly theme: string;
  readonly layout: string;
  readonly providers: readonly string[];
};

export interface Studio {
  configure(config: StudioConfig): void;
  render(): Promise<string>;
}

export interface StudioEngine {
  registerStudio(name: string, studio: Studio): void;
  getStudio(name: string): Studio | undefined;
}

export function createStudioEngine(): StudioEngine {
  const studios = new Map<string, Studio>();

  return {
    registerStudio: (name, studio) => studios.set(name, studio),
    getStudio: name => studios.get(name),
  };
}

function defaultSnapshot(): PlatformRegistrySnapshot {
  return {
    schemaVersion: 1,
    registryVersion: 'studio-v1',
    generatedAt: new Date().toISOString(),
    records: [],
  };
}

export function createStudioDashboard(): Studio {
  const memory = createMemoryManager();
  const context = createContextStore();
  const registry = new PlatformRegistry(defaultSnapshot());
  const api = createPlatformApi(registry);

  let config: StudioConfig = {
    theme: 'dark',
    layout: 'sidebar',
    providers: [],
  };

  async function renderCatalog(): Promise<string> {
    const request = {
      pathname: '/api/platform/v1/catalog',
      searchParams: new URLSearchParams(),
    };
    const response = await api.handle(request);
    const body = response.body as {
      version: string;
      records: Array<{ type: string; name: string; description: string }>;
    };
    const lines = [
      'AI Toolkit Studio — Platform Dashboard',
      `Registry version: ${body.version}`,
      `Records: ${body.records.length}`,
      '',
    ];
    for (const record of body.records.slice(0, 10)) {
      lines.push(`  • [${record.type}] ${record.name} — ${record.description}`);
    }
    return lines.join('\n');
  }

  return {
    configure(newConfig) {
      config = newConfig;
      memory.store({
        id: `studio-config-${Date.now()}`,
        content: JSON.stringify(newConfig),
        type: 'long-term',
        metadata: { source: 'studio' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      context.set({
        id: 'studio-config',
        content: JSON.stringify(newConfig),
        metadata: { theme: newConfig.theme, layout: newConfig.layout },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },

    async render() {
      const catalog = await renderCatalog();
      const ctx = context.get('studio-config');
      const memCount = memory.list().length;

      return [
        catalog,
        '',
        'Studio Configuration:',
        `  theme: ${config.theme}`,
        `  layout: ${config.layout}`,
        `  providers: ${config.providers.join(', ') || 'none'}`,
        '',
        `Context entries: ${ctx ? 1 : 0}`,
        `Memory entries: ${memCount}`,
        '',
        'Studio render complete.',
      ].join('\n');
    },
  };
}
