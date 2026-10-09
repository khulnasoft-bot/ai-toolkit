'use client';

import { useState } from 'react';
import { CodeBlock } from '@ai-toolkit/design/code-block';
import { DataTable } from '@ai-toolkit/design/data-table';
import { Drawer } from '@ai-toolkit/design/drawer';
import { FilterBar } from '@ai-toolkit/design/filter-bar';
import type { Tool } from '@/lib/tools';
import type { Column } from '@ai-toolkit/design/data-table';

const ALL = 'all';

export function ToolDirectory({
  rows,
  tags,
}: {
  rows: Tool[];
  tags: string[];
}) {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState(ALL);
  const [selected, setSelected] = useState<Tool | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter(tool => {
    if (tag !== ALL && !(tool.tags ?? []).includes(tag)) return false;
    if (
      query &&
      `${tool.name} ${tool.packageName} ${tool.description}`
        .toLowerCase()
        .indexOf(query) === -1
    ) {
      return false;
    }
    return true;
  });

  const columns: Column<Tool>[] = [
    {
      id: 'name',
      header: 'Tool',
      cell: row => <span className="font-medium">{row.name}</span>,
      sortValue: row => row.name,
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
          {(row.tags ?? []).slice(0, 4).map(tagItem => (
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
      id: 'apiKey',
      header: 'API key',
      cell: row =>
        row.apiKeyEnvName ? (
          <span className="font-mono text-[10px] text-muted-foreground">
            {row.apiKeyEnvName}
          </span>
        ) : null,
    },
  ];

  return (
    <>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search tools…"
        filters={[
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
          emptyLabel="No tools match those filters."
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Tool'}
      >
        {selected && (
          <div>
            <p className="text-sm leading-6 text-muted-foreground">
              {selected.description}
            </p>

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

            {(selected.docsUrl ||
              selected.npmUrl ||
              selected.websiteUrl ||
              selected.apiKeyUrl) && (
              <>
                <p className="eyebrow mt-7">Links</p>
                <ul className="mt-2 space-y-1.5">
                  {(
                    [
                      ['Docs', selected.docsUrl],
                      ['npm', selected.npmUrl],
                      ['Website', selected.websiteUrl],
                      ['Get an API key', selected.apiKeyUrl],
                    ] as [string, string | undefined][]
                  )
                    .filter(entry => entry[1])
                    .map(([label, url]) => (
                      <li key={label}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {label} ↗
                        </a>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
