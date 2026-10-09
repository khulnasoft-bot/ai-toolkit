import { ArrowUpRight, Grid2X2, Star } from 'lucide-react';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import { getShowcaseItems } from '@/lib/showcase';
import { resourcesTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'Showcase',
};

export default function ShowcasePage() {
  const items = getShowcaseItems();
  const featured = items.filter(item => item.featured);
  const rest = items.filter(item => !item.featured);

  return (
    <div>
      <PageTabs items={resourcesTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Showcase"
          title="See what people are shipping."
          description="Popular products and projects built with the AI SDK for proof and inspiration — all built on the same flexible primitives."
        />

        {/* Featured */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featured.map(item => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div className="absolute right-0 top-0 rounded-bl-lg bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground">
                Featured
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground">
                <Star className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {item.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {item.tag}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </a>
          ))}
        </div>

        {/* Rest */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(item => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Grid2X2 className="size-4" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {item.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {item.tag}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
