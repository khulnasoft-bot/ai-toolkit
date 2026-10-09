import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { GatewayBrowser } from '@/components/gateway-browser';
import { Faq } from '@/components/faq';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import {
  gatewayCategoryOf,
  gateways,
  getGatewayCategoriesWithCounts,
} from '@/lib/gateways';
import { getGatewayModels } from '@/lib/gateway-models';
import { gatewaysTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'AI Gateways',
};

const faqs = [
  {
    question: 'Which models are available through AI Gateways?',
    answer:
      'Language, embedding, and image models from every major lab and provider — routed through a single API. Browse the full catalog on the Models tab.',
  },
  {
    question: 'Do I need a separate account for every provider?',
    answer:
      'No. A single gateway integration gives you one API key, one call format, and unified billing and observability across all upstream providers.',
  },
  {
    question: 'How does routing and failover work?',
    answer:
      'Gateways can route by availability, cost, or latency — failing over to the same model on another provider when one degrades, with no code changes.',
  },
  {
    question: 'Does it work with the AI TOOLKIT?',
    answer:
      'Yes. Point your existing OpenAI-, Anthropic-, or Toolkit-based integration at the gateway with a base URL swap. Same calls, no rewrites.',
  },
];

export default function GatewaysPage() {
  const categories = getGatewayCategoriesWithCounts();
  const gatewaysWithCategory = gateways.map(gateway => ({
    ...gateway,
    category: gatewayCategoryOf(gateway),
  }));

  return (
    <div>
      <PageTabs
        items={gatewaysTabs}
        action={
          <a
            href="https://vercel.com/docs/ai-gateway"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Docs <ExternalLink className="size-3.5" />
          </a>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="AI Gateways"
          title="One API, every model."
          description="Browse AI gateways that unify access to hundreds of models across providers. Add routing, fallbacks, caching, and observability to a single integration."
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/gateways/models"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Browse {getGatewayModels().length} models
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="https://vercel.com/docs/ai-gateway"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-muted"
          >
            Read the gateway docs
          </Link>
        </div>
        <div className="mt-12">
          <GatewayBrowser
            categories={categories}
            gateways={gatewaysWithCategory}
          />
        </div>

        <section className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
              Routing, pricing, and lock-in
            </h2>
          </div>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
        </section>
      </div>
    </div>
  );
}
