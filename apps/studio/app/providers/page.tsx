import type { Metadata } from 'next';
import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { PageHeader } from '@/components/page-header';
import { ProviderDirectory } from '@/components/provider-directory';
import { getGatewayModels, getModelProviders } from '@/lib/models';
import { getProviderCategoryTitles, getProviders } from '@/lib/providers';
import { metricFor } from '@/lib/metrics';

export const metadata: Metadata = { title: 'Providers' };

export default function ProvidersPage() {
  const models = getGatewayModels();
  const global = metricFor('providers:global');

  const rows = getProviders().map(provider => {
    const matching = models.filter(
      model => model.providerName === provider.name,
    );
    return {
      ...provider,
      models: matching.length,
      capabilities: Array.from(
        new Set(matching.flatMap(model => model.capabilities)),
      ),
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Providers."
        description="The provider catalog with model coverage and capability chips, filtered by category. Model-backed rows show counts from the gateway model settings."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Providers"
          value={rows.length}
          delta={global.deltaPct}
        />
        <KpiCard
          label="Categories"
          value={getProviderCategoryTitles().length}
        />
        <KpiCard label="Model providers" value={getModelProviders().length} />
      </div>

      <div className="mt-8">
        <ProviderDirectory
          rows={rows}
          categories={getProviderCategoryTitles()}
        />
      </div>
    </div>
  );
}
