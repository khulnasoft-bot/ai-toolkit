'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Search } from 'lucide-react';
import type { Provider } from '@/lib/providers';

const DOCS_ROOT = 'https://studio.khulnasoft.com/providers';

export function ProviderBrowser({
  providers,
  docsSlug,
}: {
  providers: Provider[];
  docsSlug: string;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter(provider =>
      `${provider.name} ${provider.description} ${provider.slug}`
        .toLowerCase()
        .includes(q),
    );
  }, [providers, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search providers..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} providers
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(provider => (
          <Link
            key={provider.slug}
            href={`${DOCS_ROOT}/${docsSlug}/${provider.slug}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Cpu className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight">
              {provider.name}
            </h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
              {provider.description || 'AI Toolkit model provider.'}
            </p>
            <p className="mt-4 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {provider.slug}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No providers match your search.
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
