import { cn } from '../utils';

const palette = [
  '#22d3ee',
  '#a78bfa',
  '#f59e0b',
  '#34d399',
  '#f472b6',
  '#60a5fa',
];

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

const radius = 15.915;

export function Donut({
  data,
  className,
}: {
  data: DonutDatum[];
  className?: string;
}) {
  const total = data.reduce((sum, datum) => sum + datum.value, 0) || 1;
  const views = data.length === 0 ? [] : data;

  let offset = 0;
  const segments = views.map((datum, index) => {
    const fraction = datum.value / total;
    const start = offset;
    offset += fraction;
    return {
      key: datum.label,
      stroke: datum.color ?? palette[index % palette.length],
      dash: `${fraction * 100}`,
      gap: `${100 - fraction * 100}`,
      start,
    };
  });

  return (
    <div
      className={cn('flex flex-col items-center gap-5 sm:flex-row', className)}
    >
      <svg
        viewBox="0 0 42 42"
        className="size-36 shrink-0 -rotate-90"
        role="img"
        aria-label={`Distribution chart, ${total} total`}
      >
        <title>{`Distribution chart, ${total} total`}</title>
        <circle
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-surface-200/60"
        />
        {segments.map(segment => (
          <circle
            key={segment.key}
            cx="21"
            cy="21"
            r={radius}
            fill="none"
            stroke={segment.stroke}
            strokeWidth="4"
            strokeDasharray={`${segment.dash} ${segment.gap}`}
            strokeDashoffset={-segment.start * 100}
          />
        ))}
      </svg>
      <ul className="w-full space-y-1.5">
        {views.map((datum, index) => (
          <li
            key={datum.label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: datum.color ?? palette[index % palette.length],
              }}
            />
            <span className="truncate">{datum.label}</span>
            <span className="ml-auto font-mono text-[11px] text-foreground">
              {datum.value}
            </span>
          </li>
        ))}
        {views.length === 0 && (
          <li className="text-sm text-muted-foreground">No data yet.</li>
        )}
      </ul>
    </div>
  );
}
