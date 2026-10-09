'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, RecipeMeta } from '@/lib/recipes';

export function RecipeBrowser({
  categories,
  recipes,
}: {
  categories: (Category & { count: number })[];
  recipes: RecipeMeta[];
}) {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesCategory = active === 'all' || recipe.category === active;
      const haystack =
        `${recipe.title} ${recipe.description} ${recipe.tags.join(' ')}`.toLowerCase();
      const matchesQuery =
        query === '' || haystack.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [active, query, recipes]);

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
              {recipes.length}
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
            placeholder="Search recipes..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(recipe => (
          <Link
            key={`${recipe.category}-${recipe.slug}`}
            href={`/resources/recipes/${recipe.category}/${recipe.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {recipe.categoryTitle}
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">
              {recipe.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
              {recipe.description}
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {recipe.readTime} min
              </span>
              {recipe.tags.slice(0, 2).map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No recipes match your search.
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
