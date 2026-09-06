'use client';

import {
  CornerDownLeft,
  Cpu,
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  Search,
  Waypoints,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import type { SearchItem } from '@/lib/types';

interface PaletteEntry extends SearchItem {
  icon: typeof Cpu;
}

const pages: PaletteEntry[] = [
  { label: 'Overview', href: '/', section: 'Pages', icon: LayoutDashboard },
  {
    label: 'Gateways',
    href: '/gateways',
    section: 'Pages',
    icon: Waypoints,
  },
  { label: 'Models', href: '/models', section: 'Pages', icon: Cpu },
  {
    label: 'Providers',
    href: '/providers',
    section: 'Pages',
    icon: Layers,
  },
  { label: 'Tools', href: '/tools', section: 'Pages', icon: Wrench },
  {
    label: 'Templates',
    href: '/templates',
    section: 'Pages',
    icon: LayoutTemplate,
  },
];

const sectionIcons: Record<string, typeof Cpu> = {
  Gateways: Waypoints,
  Models: Cpu,
  Providers: Layers,
  Tools: Wrench,
};

const sectionOrder = ['Pages', 'Models', 'Gateways', 'Providers', 'Tools'];

const PER_GROUP = 5;

function rank(item: PaletteEntry, q: string): number {
  const label = item.label.toLowerCase();
  if (label.startsWith(q)) return 0;
  if (label.includes(q)) return 1;
  return 2;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-alpha-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </kbd>
  );
}

export function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const entries = useMemo<PaletteEntry[]>(
    () =>
      items.map(item => ({
        ...item,
        icon: sectionIcons[item.section] ?? Search,
      })),
    [items],
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [{ title: 'Pages', entries: pages }];
    const matched = entries
      .filter(
        entry =>
          entry.label.toLowerCase().includes(q) ||
          (entry.keywords ?? '').toLowerCase().includes(q),
      )
      .sort((a, b) => rank(a, q) - rank(b, q));
    const pageMatches = pages.filter(page =>
      page.label.toLowerCase().includes(q),
    );
    const out: { title: string; entries: PaletteEntry[] }[] = [];
    if (pageMatches.length > 0) {
      out.push({ title: 'Pages', entries: pageMatches.slice(0, PER_GROUP) });
    }
    for (const section of sectionOrder.slice(1)) {
      const sectionMatches = matched
        .filter(entry => entry.section === section)
        .slice(0, PER_GROUP);
      if (sectionMatches.length > 0) {
        out.push({ title: section, entries: sectionMatches });
      }
    }
    return out;
  }, [entries, query]);

  const flat = useMemo(() => groups.flatMap(group => group.entries), [groups]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  function go(entry: PaletteEntry) {
    close();
    router.push(entry.href);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) close();
        else setOpen(true);
      } else if (event.key === 'Escape') {
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-alpha-border bg-background/60 pl-3 pr-2 text-sm text-muted-foreground hover:border-alpha-border-strong hover:text-foreground"
      >
        <Search className="size-3.5" />
        <span className="flex-1 truncate text-left">Search…</span>
        <Kbd>⌘K</Kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={close}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 top-[12vh] flex justify-center px-4">
            <div className="pointer-events-auto w-full max-w-lg overflow-hidden rounded-xl border border-alpha-border-strong bg-surface-200 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-alpha-border px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={
                    flat[active] ? `${listId}-option-${active}` : undefined
                  }
                  autoComplete="off"
                  onChange={event => setQuery(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      setActive(value =>
                        flat.length === 0 ? 0 : (value + 1) % flat.length,
                      );
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      setActive(value =>
                        flat.length === 0
                          ? 0
                          : (value - 1 + flat.length) % flat.length,
                      );
                    } else if (event.key === 'Enter' && flat[active]) {
                      go(flat[active]);
                    }
                  }}
                  placeholder="Search models, gateways, tools…"
                  aria-label="Search the dashboard"
                  className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Kbd>esc</Kbd>
              </div>
              <div
                ref={listRef}
                role="listbox"
                id={listId}
                aria-label="Results"
                className="max-h-[40vh] overflow-y-auto p-2"
              >
                {flat.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No matches for “{query}”.
                  </p>
                ) : (
                  groups.map(group => (
                    <div key={group.title} className="mb-1 last:mb-0">
                      <p className="eyebrow px-2 pb-1 pt-2">{group.title}</p>
                      <ul>
                        {group.entries.map(entry => {
                          const index = flat.indexOf(entry);
                          const Icon = entry.icon;
                          return (
                            <li key={`${entry.section}-${entry.href}`}>
                              <button
                                type="button"
                                role="option"
                                id={`${listId}-option-${index}`}
                                aria-selected={index === active}
                                data-active={index === active}
                                onMouseMove={() => setActive(index)}
                                onClick={() => go(entry)}
                                className={cn(
                                  'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm',
                                  index === active
                                    ? 'bg-surface-300 text-foreground'
                                    : 'text-muted-foreground',
                                )}
                              >
                                <Icon className="size-4 shrink-0" />
                                <span className="min-w-0 flex-1 truncate">
                                  {entry.label}
                                </span>
                                {index === active && (
                                  <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center gap-4 border-t border-alpha-border bg-surface-100/60 px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Kbd>↑↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Kbd>↵</Kbd> select
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {flat.length} results
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
