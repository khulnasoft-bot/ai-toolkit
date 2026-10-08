'use client';

import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterBar({
  search,
  onSearch,
  searchPlaceholder = 'Search…',
  filters,
  aside,
}: {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-alpha-border bg-surface-100 p-3">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={event => onSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 w-full rounded-md border border-alpha-border bg-background/60 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {filters?.map(filter => (
        <div key={filter.id} className="flex items-center gap-2">
          <span className="eyebrow">{filter.label}</span>
          <select
            value={filter.value}
            onChange={event => filter.onChange(event.target.value)}
            aria-label={filter.label}
            className="h-9 rounded-md border border-alpha-border bg-background/60 px-2.5 text-sm text-foreground"
          >
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {aside}
    </div>
  );
}
