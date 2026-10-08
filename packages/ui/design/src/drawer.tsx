'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-alpha-border-strong bg-surface-100 shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-alpha-border bg-surface-200/80 px-4 backdrop-blur">
          <p className="truncate text-sm font-semibold tracking-tight">
            {title}
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-300 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
