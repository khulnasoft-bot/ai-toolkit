import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Sparkline } from './chart/sparkline';
import { cn } from './utils';

export function KpiCard({
  label,
  value,
  sub,
  delta,
  spark,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  delta?: number;
  spark?: number[];
}) {
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-alpha-border bg-surface-100 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {spark && <Sparkline data={spark} className="h-8 w-20 text-primary" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {typeof delta === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums',
              positive ? 'text-emerald-400' : 'text-amber-400',
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
