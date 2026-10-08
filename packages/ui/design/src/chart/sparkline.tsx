export function Sparkline({
  data,
  title,
  className,
}: {
  data: number[];
  title?: string;
  className?: string;
}) {
  if (data.length < 2) return null;
  const width = 120;
  const height = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((value, index) => {
    const x = (index * step).toFixed(1);
    const y = (height - ((value - min) / range) * (height - 4) - 2).toFixed(1);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label={title ?? 'Trend line'}
    >
      {title && <title>{title}</title>}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
