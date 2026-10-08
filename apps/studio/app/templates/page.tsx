import type { Metadata } from 'next';
import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { PageHeader } from '@/components/page-header';
import { TemplateGrid } from '@/components/template-grid';
import { getTemplateFrameworks, getTemplates } from '@/lib/templates';
import { metricFor } from '@/lib/metrics';

export const metadata: Metadata = { title: 'Templates' };

export default function TemplatesPage() {
  const templates = getTemplates();
  const frameworks = getTemplateFrameworks();
  const global = metricFor('templates:global');

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Registry"
        title="Templates."
        description="Starter applications in the examples catalog, grouped by framework and provider."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Templates"
          value={templates.length}
          delta={global.deltaPct}
        />
        <KpiCard label="Frameworks" value={frameworks.length} />
        <KpiCard
          label="Categories"
          value="4"
          sub="Foundations, integrations, tools"
        />
      </div>

      <div className="mt-8">
        <TemplateGrid rows={templates} frameworks={frameworks} />
      </div>
    </div>
  );
}
