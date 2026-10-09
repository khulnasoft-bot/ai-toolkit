'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { FilterBar } from '@ai-toolkit/design/filter-bar';
import { frameworkLabels } from '@/lib/templates';
import type { TemplateEntry } from '@/lib/types';

const ALL = 'all';

export function TemplateGrid({
  rows,
  frameworks,
}: {
  rows: TemplateEntry[];
  frameworks: string[];
}) {
  const [search, setSearch] = useState('');
  const [framework, setFramework] = useState(ALL);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter(template => {
    if (framework !== ALL && template.framework !== framework) return false;
    if (
      query &&
      `${template.title} ${template.description} ${template.tags.join(' ')}`
        .toLowerCase()
        .indexOf(query) === -1
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search templates…"
        filters={[
          {
            id: 'framework',
            label: 'Framework',
            value: framework,
            onChange: setFramework,
            options: [
              { value: ALL, label: 'All' },
              ...frameworks.map(value => ({
                value,
                label: frameworkLabels[value] ?? value,
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

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No templates match those filters.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(template => (
            <a
              key={template.name}
              href={template.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-xl border border-alpha-border bg-surface-100 p-5 transition-colors hover:border-alpha-border-strong hover:bg-surface-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="eyebrow">
                  {frameworkLabels[template.framework] ?? template.framework}
                </span>
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight">
                {template.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {template.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {template.tags.slice(0, 4).map(tagItem => (
                  <span
                    key={tagItem}
                    className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {tagItem}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
