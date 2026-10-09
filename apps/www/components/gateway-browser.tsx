'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Key,
  Search,
  Waypoints,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gateway } from '@/lib/gateways';
import type { GatewayCategory } from '@/lib/gateways';

const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const;

export function GatewayBrowser({
  categories,
  gateways,
}: {
  categories: (GatewayCategory & { count: number })[];
  gateways: (Gateway & { category: string })[];
}) {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Gateway | null>(null);

  const filtered = useMemo(() => {
    return gateways.filter(gateway => {
      const matchesCategory = active === 'all' || gateway.category === active;
      const haystack =
        `${gateway.name} ${gateway.developer} ${gateway.description} ${(gateway.tags ?? []).join(' ')}`.toLowerCase();
      const matchesQuery =
        query === '' || haystack.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [active, query, gateways]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive('all')}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              active === 'all'
                ? 'border-border bg-muted text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
            )}
          >
            All
            <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
              {gateways.length}
            </span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActive(category.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                active === category.id
                  ? 'border-border bg-muted text-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
              )}
            >
              {category.title}
              <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                {category.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative lg:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search gateways..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map(gateway => (
          <div
            key={gateway.slug}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Waypoints className="size-5" />
              </div>
              <button
                onClick={() =>
                  setSelected(selected?.slug === gateway.slug ? null : gateway)
                }
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <code className="text-[11px]">{gateway.packageName}</code>
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight">
                {gateway.name}
              </h3>
              {gateway.featured && (
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              by {gateway.developer}
            </p>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
              {gateway.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(gateway.tags ?? []).slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
              <InstallButton gateway={gateway} />
              {gateway.docsUrl && (
                <a
                  href={gateway.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Docs <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No gateways match your search.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setActive('all');
            }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Gateway detail drawer */}
      {selected && (
        <div className="mt-8 rounded-xl border border-foreground/25 bg-card">
          <div className="flex items-start justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                {selected.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {selected.packageName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selected.apiKeyEnvName && (
                <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Key className="size-3" />
                  {selected.apiKeyEnvName}
                </span>
              )}
              <button
                onClick={() => setSelected(null)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Install
              </p>
              <div className="space-y-2">
                {packageManagers.map(manager => (
                  <InstallRow
                    key={manager}
                    command={selected.installCommand[manager]}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.websiteUrl && (
                  <a
                    href={selected.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    Website <ExternalLink className="size-3" />
                  </a>
                )}
                {selected.npmUrl && (
                  <a
                    href={selected.npmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    npm <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Example
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 text-[12px] leading-5 text-foreground/90">
                <code>{selected.codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstallButton({ gateway }: { gateway: Gateway }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(gateway.installCommand.npm);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : 'npm install'}
    </button>
  );
}

function InstallRow({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
      <code className="truncate text-xs">{command}</code>
      <button
        onClick={copy}
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
