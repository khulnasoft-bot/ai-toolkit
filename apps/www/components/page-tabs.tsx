'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PageTab } from '@/lib/site-nav';

export function PageTabs({
  items,
  action,
}: {
  items: PageTab[];
  action?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-14 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 lg:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {items.map(item => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors',
                  active
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {action && (
          <div className="hidden shrink-0 pb-3 sm:block">{action}</div>
        )}
      </div>
    </div>
  );
}
