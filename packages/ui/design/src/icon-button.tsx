import type { ButtonHTMLAttributes } from 'react';
import { cn } from './utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      className={cn(
        'flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-200 hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
