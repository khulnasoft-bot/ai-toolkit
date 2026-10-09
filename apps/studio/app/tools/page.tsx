import type { Metadata } from 'next';
import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { PageHeader } from '@/components/page-header';
import { ToolDirectory } from '@/components/tool-directory';
import { getToolTags, tools } from '@/lib/tools';
import { metricFor } from '@/lib/metrics';

export const metadata: Metadata = { title: 'Tools' };

export default function ToolsPage() {
  const global = metricFor('tools:global');

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Registry"
        title="Tools."
        description="The tools ecosystem that plugs into the AI SDK — code execution, search, databases, and more. Open a row for install commands and usage."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Tools" value={tools.length} delta={global.deltaPct} />
        <KpiCard label="Tags" value={getToolTags().length} />
        <KpiCard
          label="Requests"
          value="—"
          sub="No runtime metrics for registry tools"
        />
      </div>

      <div className="mt-8">
        <ToolDirectory rows={tools} tags={getToolTags()} />
      </div>
    </div>
  );
}
