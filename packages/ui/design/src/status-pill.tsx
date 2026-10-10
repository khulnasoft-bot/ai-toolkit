import { cn } from './utils';

const dotStyles: Record<string, string> = {
  operational: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  quiet: 'bg-zinc-500',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <span
        className={cn(
          'size-1.5 rounded-full',
          dotStyles[status] ?? 'bg-zinc-500',
        )}
      />
      {status}
    </span>
  );
}
