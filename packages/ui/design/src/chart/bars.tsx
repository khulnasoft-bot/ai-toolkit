import { cn } from '../utils';

export interface BarDatum {
  label: string;
  value: number;
  hint?: string;
}

export function Bars({
  data,
  className,
}: {
  data: BarDatum[];
  className?: string;
}) {
  if (data.length === 0) {
    return (
      <p
        className={cn(
          'py-8 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        No data yet.
      </p>
    );
  }

  const max = Math.max(...data.map(datum => datum.value), 1);

  return (
    <div className={cn('flex h-40 items-end gap-1.5', className)}>
      {data.map(datum => (
        <div
          key={datum.label}
          title={datum.hint ?? `${datum.label}: ${datum.value}`}
          className="group relative flex h-full flex-1 flex-col justify-end"
        >
          <div
            className="w-full rounded-t-sm bg-surface-300 transition-colors group-hover:bg-primary/70"
            style={{
              height: `${Math.max((datum.value / max) * 100, 4)}%`,
            }}
          />
          <span className="mt-1.5 hidden truncate text-center text-[10px] text-muted-foreground sm:block">
            {datum.label}
          </span>
        </div>
      ))}
    </div>
  );
}
