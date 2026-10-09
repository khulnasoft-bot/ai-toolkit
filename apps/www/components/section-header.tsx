import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'center' | 'left';
}) {
  return (
    <div
      className={cn(
        align === 'center' ? 'mx-auto text-center' : '',
        'max-w-2xl',
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-.04em] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
