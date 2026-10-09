'use client';

import { useMemo, useState } from 'react';
import { Bot, Image, Layers, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  GatewayModel,
  GatewayModelModality,
  GatewayModelProvider,
} from '@/lib/gateway-models';

const modalities: { id: GatewayModelModality | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'language', label: 'Language' },
  { id: 'embedding', label: 'Embedding' },
  { id: 'image', label: 'Image' },
];

const modalityMeta: Record<
  GatewayModelModality,
  { icon: typeof Bot; label: string; className: string }
> = {
  language: {
    icon: Bot,
    label: 'Language',
    className: 'text-muted-foreground bg-muted',
  },
  embedding: {
    icon: Layers,
    label: 'Embedding',
    className: 'text-muted-foreground bg-muted',
  },
  image: {
    icon: Image,
    label: 'Image',
    className: 'text-muted-foreground bg-muted',
  },
};

export function GatewayModelsBrowser({
  models,
  providers,
}: {
  models: GatewayModel[];
  providers: GatewayModelProvider[];
}) {
  const [active, setActive] = useState<GatewayModelModality | 'all'>('all');
  const [provider, setProvider] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return models.filter(model => {
      const matchesModality = active === 'all' || model.modality === active;
      const matchesProvider = provider === 'all' || model.provider === provider;
      const matchesQuery =
        query === '' ||
        `${model.id} ${model.provider}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesModality && matchesProvider && matchesQuery;
    });
  }, [models, active, provider, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {modalities.map(modality => (
            <button
              key={modality.id}
              onClick={() => setActive(modality.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                active === modality.id
                  ? 'border-border bg-muted text-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
              )}
            >
              {modality.label}
              <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                {modality.id === 'all'
                  ? models.length
                  : models.filter(model => model.modality === modality.id)
                      .length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="provider-filter">
            Filter by provider
          </label>
          <select
            id="provider-filter"
            value={provider}
            onChange={event => setProvider(event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All providers</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} ({provider.count})
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search models..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-56"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(model => {
          const meta = modalityMeta[model.modality];
          const Icon = meta.icon;
          const providerName =
            providers.find(p => p.id === model.provider)?.name ??
            model.provider;
          return (
            <div
              key={`${model.modality}-${model.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  meta.className,
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p
                  className="truncate font-mono text-xs text-foreground"
                  title={model.id}
                >
                  {model.id}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {providerName}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No models match your filters.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setActive('all');
              setProvider('all');
            }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
