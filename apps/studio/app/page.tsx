import type { Metadata } from 'next';
import { Bars } from '@ai-toolkit/design/bars';
import { Donut } from '@ai-toolkit/design/donut';
import {
  GatewayStatusTable,
  TopModelsTable,
} from '@/components/overview-tables';
import { OverviewLive } from '@/components/overview-live';
import { PageHeader } from '@/components/page-header';
import { Panel } from '@ai-toolkit/design/panel';
import { Section } from '@ai-toolkit/design/section';
import { getGatewayRows } from '@/lib/gateways';
import { getOverviewMetrics } from '@/lib/metrics-provider';
import {
  getGatewayModels,
  getModelMetrics,
  getModelProviders,
} from '@/lib/models';
import { getProviders } from '@/lib/providers';
import { tools } from '@/lib/tools';
import { getTemplates } from '@/lib/templates';
import type { ModelEntry, Metric } from '@/lib/types';

export const metadata: Metadata = { title: 'Overview' };

export default async function OverviewPage() {
  const models = getGatewayModels();
  const providerEntries = getProviders();
  const gateways = getGatewayRows();

  const counts = {
    providers: providerEntries.length,
    models: models.length,
    gateways: gateways.length,
    tools: tools.length,
  };
  const fallback = await getOverviewMetrics(counts);

  const providerShare = getModelProviders().slice(0, 8);
  const modalityCounts = models.reduce<Record<string, number>>(
    (acc, model) => {
      acc[model.modality] = (acc[model.modality] ?? 0) + 1;
      return acc;
    },
    { language: 0, embedding: 0, image: 0 },
  );

  const topModels: (ModelEntry & { metrics: Metric })[] = models
    .map(model => ({ ...model, metrics: getModelMetrics(model.id) }))
    .sort((a, b) => b.metrics.requests - a.metrics.requests)
    .slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Studio · Overview"
        title="AI Toolkit at a glance."
        description="A read-only dashboard over the catalog — KPIs rehydrate from the metrics API, catalog data stays static. Search from the top bar or drill into a section."
      />

      <OverviewLive fallback={fallback} counts={counts} />

      <Section title="Distribution">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Models by provider">
            <Bars
              data={providerShare.map(provider => ({
                label: provider.name,
                value: provider.count,
                hint: `${provider.name}: ${provider.count} models`,
              }))}
            />
          </Panel>
          <Panel title="Models by modality">
            <Donut
              data={[
                { label: 'Language', value: modalityCounts.language },
                { label: 'Embedding', value: modalityCounts.embedding },
                { label: 'Image', value: modalityCounts.image },
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section
        title="Top models by requests"
        aside={
          <p className="eyebrow">
            {counts.models} models · {providerShare.length}+ providers
          </p>
        }
      >
        <TopModelsTable rows={topModels} />
      </Section>

      <Section title="Gateway status">
        <GatewayStatusTable rows={gateways} />
      </Section>
    </div>
  );
}
