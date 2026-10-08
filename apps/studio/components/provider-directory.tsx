'use client';

import { useState } from 'react';
import { DataTable } from '@ai-toolkit/design/data-table';
import { Drawer } from '@ai-toolkit/design/drawer';
import { FilterBar } from '@ai-toolkit/design/filter-bar';
import type { Column } from '@ai-toolkit/design/data-table';

const ALL = 'all';

export interface ProviderRow {
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryTitle: string;
  models: number;
  capabilities: string[];
}

export function ProviderDirectory({
  rows,
  categories,
}: {
  rows: ProviderRow[];
  categories: { id: string; title: string }[];
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [selected, setSelected] = useState<ProviderRow | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter(row => {
    if (category !== ALL && row.category !== category) return false;
    if (
      query &&
      `${row.name} ${row.slug} ${row.description}`
        .toLowerCase()
        .indexOf(query) === -1
    ) {
      return false;
    }
    return true;
  });

  const columns: Column<ProviderRow>[] = [
    {
      id: 'name',
      header: 'Provider',
      cell: row => <span className="font-medium">{row.name}</span>,
      sortValue: row => row.name,
    },
    {
      id: 'category',
      header: 'Category',
      cell: row => (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {row.category}
        </span>
      ),
      sortValue: row => row.category,
    },
    {
      id: 'capabilities',
      header: 'Capabilities',
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {row.capabilities.slice(0, 4).map(capability => (
            <span
              key={capability}
              className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {capability}
            </span>
          ))}
          {row.capabilities.length === 0 && (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      id: 'models',
      header: 'Models',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: row => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {row.models}
        </span>
      ),
      sortValue: row => row.models,
    },
  ];

  return (
    <>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search providers…"
        filters={[
          {
            id: 'category',
            label: 'Category',
            value: category,
            onChange: setCategory,
            options: [
              { value: ALL, label: 'All' },
              ...categories.map(value => ({
                value: value.id,
                label: value.title,
              })),
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
          emptyLabel="No providers match those filters."
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Provider'}
      >
        {selected && (
          <div>
            <p className="text-sm leading-6 text-muted-foreground">
              {selected.description || 'No description.'}
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              {(
                [
                  ['Category', selected.categoryTitle],
                  ['Models', String(selected.models)],
                  ['Slug', selected.slug],
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
            {selected.capabilities.length > 0 && (
              <>
                <p className="eyebrow mt-7">Capabilities</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.capabilities.map(capability => (
                    <span
                      key={capability}
                      className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
