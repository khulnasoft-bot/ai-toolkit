'use client';

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from './utils';

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
}

const PAGE_SIZE = 10;

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
  emptyLabel = 'Nothing to show yet.',
}: {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
}) {
  const [sort, setSort] = useState<{ id: string; dir: 'asc' | 'desc' } | null>(
    null,
  );
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const column = columns.find(col => col.id === sort.id);
    if (!column?.sortValue) return data;
    const { dir } = sort;
    return [...data].sort((a, b) => {
      const aValue = column.sortValue!(a);
      const bValue = column.sortValue!(b);
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return dir === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return dir === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function toggleSort(id: string) {
    setSort(prev =>
      prev?.id === id
        ? { id, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { id, dir: 'asc' },
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-alpha-border bg-surface-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-alpha-border bg-surface-200/60">
              {columns.map(column => (
                <th
                  key={column.id}
                  aria-sort={
                    column.sortValue
                      ? sort?.id === column.id
                        ? sort.dir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={cn(
                    'px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground',
                    column.headerClassName,
                  )}
                >
                  {column.sortValue ? (
                    <button
                      onClick={() => toggleSort(column.id)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {column.header}
                      {sort?.id === column.id ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ArrowUp className="size-3 opacity-0" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-alpha-border last:border-0',
                  onRowClick &&
                    'cursor-pointer transition-colors hover:bg-surface-200/60',
                )}
              >
                {columns.map(column => (
                  <td
                    key={column.id}
                    className={cn('px-4 py-3', column.className)}
                  >
                    {column.cell ? column.cell(row) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-alpha-border bg-surface-200/40 px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {sorted.length} rows
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 0}
            onClick={() => setPage(value => Math.max(0, value - 1))}
            aria-label="Previous page"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-300 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-1 font-mono text-[11px] text-muted-foreground">
            {safePage + 1} / {pageCount}
          </span>
          <button
            disabled={safePage === pageCount - 1}
            onClick={() => setPage(value => Math.min(pageCount - 1, value + 1))}
            aria-label="Next page"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-300 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
