'use client';

import { useState } from 'react';
import { CodeBlock } from '@ai-toolkit/design/code-block';
import { DataTable } from '@ai-toolkit/design/data-table';
import { Drawer } from '@ai-toolkit/design/drawer';
import { FilterBar } from '@ai-toolkit/design/filter-bar';
import { StatusPill } from '@ai-toolkit/design/status-pill';
import { formatCost, formatLatency, formatRequests } from '@/lib/metrics';
import type { GatewayRow } from '@/lib/gateways';
import type { Column } from '@ai-toolkit/design/data-table';

const ALL = 'all';

export function GatewayDirectory({
  rows,
  developers,
  tags,
}: {
  rows: GatewayRow[];
  developers: string[];
  tags: string[];
}) {
  const [search, setSearch] = useState('');
  const [developer, setDeveloper] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [selected, setSelected] = useState<GatewayRow | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter(row => {
    if (developer !== ALL && row.developer !== developer) return false;
    if (tag !== ALL && !(row.tags ?? []).includes(tag)) return false;
    if (
      query &&
      `${row.name} ${row.developer} ${row.packageName} ${row.description}`
        .toLowerCase()
        .indexOf(query) === -1
    ) {
      return false;
    }
    return true;
  });

  const columns: Column<GatewayRow>[] = [
    {
      id: 'name',
      header: 'Gateway',
      cell: row => <span className="font-medium">{row.name}</span>,
      sortValue: row => row.name,
    },
    {
      id: 'developer',
      header: 'Developer',
      cell: row => (
        <span className="text-muted-foreground">{row.developer}</span>
      ),
      sortValue: row => row.developer,
    },
    {
      id: 'package',
      header: 'Package',
      cell: row => (
        <span className="font-mono text-[11px] text-primary">
          {row.packageName}
        </span>
      ),
      sortValue: row => row.packageName,
    },
    {
      id: 'tags',
      header: 'Tags',
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {(row.tags ?? []).slice(0, 3).map(tagItem => (
            <span
              key={tagItem}
              className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tagItem}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: row => <StatusPill status={row.status} />,
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
        searchPlaceholder="Search gateways…"
        filters={[
          {
            id: 'developer',
            label: 'Developer',
            value: developer,
            onChange: setDeveloper,
            options: [
              { value: ALL, label: 'All' },
              ...developers.map(value => ({ value, label: value })),
            ],
          },
          {
            id: 'tag',
            label: 'Tag',
            value: tag,
            onChange: setTag,
            options: [
              { value: ALL, label: 'All' },
              ...tags.map(value => ({ value, label: value })),
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
          getRowKey={row => row.slug}
          onRowClick={setSelected}
          emptyLabel="No gateways match those filters."
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Gateway'}
      >
        {selected && (
          <div>
            <p className="text-sm leading-6 text-muted-foreground">
              {selected.description}
            </p>

            <dl className="mt-5 space-y-2 text-sm">
              {[
                ['Developer', selected.developer],
                ['Package', selected.packageName],
                ['Docs', selected.docsUrl],
                ['Website', selected.websiteUrl],
                ['API key env', selected.apiKeyEnvName],
              ]
                .filter(entry => entry[1])
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="min-w-0 truncate text-right font-mono text-[11px] text-foreground/90">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>

            <p className="eyebrow mt-7">Install</p>
            <CodeBlock
              className="mt-2"
              title={selected.packageName}
              lines={[
                selected.installCommand.pnpm,
                selected.installCommand.npm,
                selected.installCommand.yarn,
              ]}
            />

            <p className="eyebrow mt-7">Metrics</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                [formatRequests(selected.metrics.requests), 'Requests'],
                [formatLatency(selected.metrics.latencyMs), 'Latency'],
                [formatCost(selected.metrics.costUsd), 'Cost'],
                [`${selected.metrics.uptimePct}%`, 'Uptime'],
              ].map(([value, label]) => (
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

            {selected.codeExample && (
              <>
                <p className="eyebrow mt-7">Usage</p>
                <CodeBlock
                  className="mt-2"
                  language="typescript"
                  title="example"
                  lines={selected.codeExample.split('\n')}
                />
              </>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
