import Link from 'next/link';
import { ArrowUpRight, Blocks, Bot, Cpu, Plug, Users } from 'lucide-react';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import {
  getProviderCategoriesWithCounts,
  type ProviderCategoryId,
} from '@/lib/providers';
import { providersTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'Providers',
};

const kindIcons: Record<ProviderCategoryId, typeof Bot> = {
  'ai-toolkit': Cpu,
  'openai-compatible': Plug,
  community: Users,
  adapters: Blocks,
  observability: Bot,
};

export default function ProvidersPage() {
  const categories = getProviderCategoriesWithCounts();

  return (
    <div>
      <PageTabs items={providersTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Providers"
          title="One interface, every model."
          description="Connect to any model provider through the same AI TOOLKIT primitives — first-party, OpenAI-compatible, community, framework adapters, and observability tooling."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {categories.map(category => {
            const Icon = kindIcons[category.id];
            return (
              <Link
                key={category.id}
                href={`/providers/${category.docsSlug}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-5 eyebrow">{category.eyebrow}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {category.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-4 eyebrow">{category.count} providers</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
