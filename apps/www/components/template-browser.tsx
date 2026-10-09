'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Boxes, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Template, TemplateCategory } from '@/lib/templates';
import { frameworkLabels } from '@/lib/templates';

export function TemplateBrowser({
  categories,
}: {
  categories: TemplateCategory[];
}) {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const allTemplates: Template[] = useMemo(
    () => categories.flatMap(category => category.templates),
    [categories],
  );

  const filtered = useMemo(() => {
    return allTemplates.filter(template => {
      const matchesCategory = active === 'all' || template.category === active;
      const haystack =
        `${template.title} ${template.description} ${template.tags.join(' ')}`.toLowerCase();
      const matchesQuery =
        query === '' || haystack.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [active, query, allTemplates]);

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
              {allTemplates.length}
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
                {category.templates.length}
              </span>
            </button>
          ))}
        </div>
        <div className="relative lg:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(template => (
          <a
            key={template.name}
            href={template.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Boxes className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight">
              {template.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
              {template.description}
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {frameworkLabels[template.framework] ?? template.framework}
              </span>
              {template.primaryProvider && (
                <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {template.primaryProvider}
                </span>
              )}
              {template.tags.length > 0 && (
                <span className="ml-auto rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {template.tags[0]}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No templates match your search.
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
    </div>
  );
}
