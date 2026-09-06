'use client';

import {
  Cpu,
  Github,
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  Menu,
  Sparkles,
  Waypoints,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CommandPalette } from './command-palette';
import type { SearchItem } from '@/lib/types';

const sections: {
  title: string;
  items: { label: string; href: string; icon: typeof Cpu }[];
}[] = [
  {
    title: 'Overview',
    items: [{ label: 'Overview', href: '/', icon: LayoutDashboard }],
  },
  {
    title: 'Network',
    items: [
      { label: 'Gateways', href: '/gateways', icon: Waypoints },
      { label: 'Models', href: '/models', icon: Cpu },
      { label: 'Providers', href: '/providers', icon: Layers },
    ],
  },
  {
    title: 'Registry',
    items: [
      { label: 'Tools', href: '/tools', icon: Wrench },
      { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    ],
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {sections.map(section => (
        <div key={section.title}>
          <p className="eyebrow mb-2 px-2">{section.title}</p>
          <ul className="space-y-0.5">
            {section.items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-surface-200 font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-surface-200 hover:text-foreground',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4',
                        active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      AI Studio
    </Link>
  );
}

export function StudioShell({
  items,
  children,
}: {
  items: SearchItem[];
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:pl-56">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-alpha-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-alpha-border px-4">
          <Brand />
        </div>
        <SidebarNav />
        <div className="border-t border-alpha-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Seed data · read-only
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-alpha-border bg-background">
            <div className="flex h-16 items-center justify-between border-b border-alpha-border px-4">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-2 text-muted-foreground hover:bg-surface-200 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-alpha-border-strong bg-surface-200/80 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-surface-300 hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </button>
          <div className="flex-1 lg:hidden">
            <Brand />
          </div>
          <div className="min-w-0 flex-1 lg:max-w-lg">
            <CommandPalette items={items} />
          </div>
          <div className="hidden items-center gap-1 xl:flex">
            <a
              href="https://studio.khulnasoft.com/playground"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface-300 hover:text-foreground"
            >
              AI Gateway ↗
            </a>
          </div>
          <a
            href="https://github.com/khulnasoft/ai-toolkit"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-muted-foreground hover:bg-surface-300 hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
