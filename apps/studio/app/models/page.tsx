import type { Metadata } from 'next';
import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { ModelDirectory } from '@/components/model-directory';
import { PageHeader } from '@/components/page-header';
import {
  getGatewayModels,
  getModelCounts,
  getModelMetrics,
  getModelProviders,
} from '@/lib/models';
import { metricFor } from '@/lib/metrics';

export const metadata: Metadata = { title: 'Models' };

export default function ModelsPage() {
  const models = getGatewayModels();
  const counts = getModelCounts();
  const global = metricFor('models:global');

  const rows = models.map(model => ({
    ...model,
    metrics: getModelMetrics(model.id),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Models."
        description="Every model the AI Gateway can route to — language, embedding, and image. Capability chips come from provider-level metadata."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <KpiCard
          label="Total models"
          value={models.length}
          delta={global.deltaPct}
        />
        <KpiCard label="Language" value={counts.language} />
        <KpiCard label="Embedding" value={counts.embedding} />
        <KpiCard label="Image" value={counts.image} />
      </div>

      <div className="mt-8">
        <ModelDirectory
          rows={rows}
          providers={getModelProviders().map(provider => provider.name)}
        />
      </div>
    </div>
  );
}
