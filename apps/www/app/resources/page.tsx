import Link from 'next/link';
import { ArrowUpRight, Boxes, Grid2X2, Library, Wrench } from 'lucide-react';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import { resources, type ResourceKind } from '@/lib/resources';
import { resourcesTabs } from '@/lib/site-nav';

const kindIcons: Record<ResourceKind, typeof Library> = {
  recipes: Library,
  tools: Wrench,
  templates: Boxes,
  showcase: Grid2X2,
};

export const metadata = {
  title: 'Resources',
};

export default function ResourcesPage() {
  const groups = resources.getKinds();
  const total = resources.all.length;

  return (
    <div>
      <PageTabs items={resourcesTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Resources"
          title="Everything you need to ship AI."
          description={`Recipes to build with, tools to wire in, templates to fork, and inspiration from the community — ${total} curated resources.`}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {groups.map(group => {
            const Icon = kindIcons[group.kind];
            return (
              <Link
                key={group.kind}
                href={group.href}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-5 eyebrow">{group.eyebrow}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {group.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {group.description}
                </p>
                <p className="mt-4 eyebrow">{group.entries.length} items</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
