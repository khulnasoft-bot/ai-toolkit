'use client';

import { useState } from 'react';
import { DataTable } from '@ai-toolkit/design/data-table';
import { Drawer } from '@ai-toolkit/design/drawer';
import { FilterBar } from '@ai-toolkit/design/filter-bar';
import { formatCost, formatLatency, formatRequests } from '@/lib/metrics';
import type { ModelEntry } from '@/lib/types';
import type { Metric } from '@/lib/types';
import type { Column } from '@ai-toolkit/design/data-table';

const ALL = 'all';

export type ModelRow = ModelEntry & { metrics: Metric };

export function ModelDirectory({
  rows,
  providers,
}: {
  rows: ModelRow[];
  providers: string[];
}) {
  const [search, setSearch] = useState('');
  const [modality, setModality] = useState(ALL);
  const [provider, setProvider] = useState(ALL);
  const [selected, setSelected] = useState<ModelRow | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter(row => {
    if (modality !== ALL && row.modality !== modality) return false;
    if (provider !== ALL && row.providerName !== provider) return false;
    if (
      query &&
      `${row.id} ${row.providerName}`.toLowerCase().indexOf(query) === -1
    ) {
      return false;
    }
    return true;
  });

  const columns: Column<ModelRow>[] = [
    {
      id: 'id',
      header: 'Model',
      cell: row => (
        <span className="font-mono text-[12px] text-foreground/90">
          {row.id}
        </span>
      ),
      sortValue: row => row.id,
    },
    {
      id: 'provider',
      header: 'Provider',
      cell: row => (
        <span className="text-muted-foreground">{row.providerName}</span>
      ),
      sortValue: row => row.providerName,
    },
    {
      id: 'modality',
      header: 'Modality',
      cell: row => (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {row.modality}
        </span>
      ),
      sortValue: row => row.modality,
    },
    {
      id: 'capabilities',
      header: 'Capabilities',
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {row.capabilities.map(capability => (
            <span
              key={capability}
              className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {capability}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'latency',
      header: 'Latency',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: row => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {formatLatency(row.metrics.latencyMs)}
        </span>
      ),
      sortValue: row => row.metrics.latencyMs,
    },
    {
      id: 'requests',
      header: 'Requests',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: row => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {formatRequests(row.metrics.requests)}
        </span>
      ),
      sortValue: row => row.metrics.requests,
    },
  ];

  return (
    <>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search models…"
        filters={[
          {
            id: 'modality',
            label: 'Modality',
            value: modality,
            onChange: setModality,
            options: [
              { value: ALL, label: 'All' },
              { value: 'language', label: 'Language' },
              { value: 'embedding', label: 'Embedding' },
              { value: 'image', label: 'Image' },
            ],
          },
          {
            id: 'provider',
            label: 'Provider',
            value: provider,
            onChange: setProvider,
            options: [
              { value: ALL, label: 'All' },
              ...providers.map(value => ({ value, label: value })),
            ],
          },
        ]}
        aside={
          <p className="eyebrow hidden sm:block">
            {filtered.length} of {rows.length}
          </p>
        }
      />

      <div className="mt-4">
        <DataTable
          data={filtered}
          columns={columns}
          getRowKey={row => row.id}
          onRowClick={setSelected}
          emptyLabel="No models match those filters."
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.id ?? 'Model'}
      >
        {selected && (
          <div>
            <p className="break-all font-mono text-[12px] leading-6 text-foreground/90">
              {selected.id}
            </p>

            <dl className="mt-5 space-y-2 text-sm">
              {(
                [
                  ['Provider', selected.providerName],
                  ['Modality', selected.modality],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-foreground/90">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="eyebrow mt-7">Capabilities</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.capabilities.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  None listed.
                </span>
              )}
              {selected.capabilities.map(capability => (
                <span
                  key={capability}
                  className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {capability}
                </span>
              ))}
            </div>

            <p className="eyebrow mt-7">Metrics</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(
                [
                  [formatRequests(selected.metrics.requests), 'Requests'],
                  [formatLatency(selected.metrics.latencyMs), 'Latency'],
                  [formatLatency(selected.metrics.p99Ms), 'p99'],
                  [formatCost(selected.metrics.costUsd), 'Cost'],
                ] as [string, string][]
              ).map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-alpha-border bg-surface-200/60 p-3"
                >
                  <p className="text-lg font-semibold tabular-nums tracking-tight">
                    {value}
                  </p>
                  <p className="eyebrow mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
