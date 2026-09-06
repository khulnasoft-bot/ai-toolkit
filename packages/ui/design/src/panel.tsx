import type { ReactNode } from 'react';
import { cn } from './utils';

export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-alpha-border bg-surface-100 p-5',
        className,
      )}
    >
      {(title || aside) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="eyebrow">{title}</p>
          {aside}
        </div>
      )}
      {children}
    </div>
  );
}
