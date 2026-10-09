'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Github, Menu, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

const navItems: NavItem[] = [
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { href: '/resources/recipes', label: 'Recipes' },
      { href: '/resources/tools', label: 'Tools Registry' },
      { href: '/resources/templates', label: 'Templates' },
      { href: '/resources/showcase', label: 'Showcase' },
    ],
  },
  {
    label: 'Providers',
    href: '/providers',
    children: [
      { href: '/providers/ai-toolkit-providers', label: 'AI Toolkit' },
      {
        href: '/providers/openai-compatible-providers',
        label: 'OpenAI-Compatible',
      },
      { href: '/providers/community-providers', label: 'Community' },
      { href: '/providers/adapters', label: 'Adapters' },
      { href: '/providers/observability', label: 'Observability' },
    ],
  },
  {
    label: 'Gateways',
    href: '/gateways',
    children: [{ href: '/gateways/models', label: 'Models' }],
  },
  { href: '/playground', label: 'Playground' },
];

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(item: NavItem, pathname: string): boolean {
  return (
    isActive(item.href ?? '', pathname) ||
    item.children?.some(child => isActive(child.href, pathname)) === true
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  useEffect(() => {
    setDropdown(null);
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-alpha-border-strong bg-surface-200/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            AI TOOLKIT
          </Link>
        </div>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          {navItems.map(item => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setDropdown(dropdown === item.label ? null : item.label)
                    }
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 hover:bg-muted hover:text-foreground',
                      isItemActive(item, pathname) &&
                        'bg-muted text-foreground',
                      dropdown === item.label && 'bg-muted text-foreground',
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </button>
                  {dropdown === item.label && (
                    <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-alpha-border bg-surface-200 p-1.5 shadow-lg">
                      <Link
                        href={item.href ?? '#'}
                        onClick={() => setDropdown(null)}
                        className={cn(
                          'block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted',
                          isActive(item.href ?? '', pathname) &&
                            'bg-muted text-foreground',
                        )}
                      >
                        Overview
                      </Link>
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDropdown(null)}
                          className={cn(
                            'block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                            isActive(child.href, pathname) &&
                              'bg-muted text-foreground',
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href ?? '#'}
                  className={cn(
                    'rounded-md px-3 py-2 hover:bg-muted hover:text-foreground',
                    isActive(item.href ?? '', pathname) &&
                      'bg-muted text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/khulnasoft/ai-toolkit"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Github className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link
            href="/resources/recipes"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-alpha-border px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <div key={item.label}>
                <Link
                  href={item.href ?? '#'}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                    isItemActive(item, pathname) && 'bg-muted text-foreground',
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                          isActive(child.href, pathname) &&
                            'bg-muted text-foreground',
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
