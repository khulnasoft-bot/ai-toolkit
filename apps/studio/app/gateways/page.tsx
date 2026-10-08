import type { Metadata } from 'next';
import { GatewayDirectory } from '@/components/gateway-directory';
import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { PageHeader } from '@/components/page-header';
import {
  getGatewayDevelopers,
  getGatewayRows,
  getGatewayTags,
} from '@/lib/gateways';
import { formatLatency, formatRequests, metricFor } from '@/lib/metrics';

export const metadata: Metadata = { title: 'Gateways' };

export default function GatewaysPage() {
  const rows = getGatewayRows();
  const global = metricFor('gateways:global');
  const avgLatency =
    rows.reduce((sum, row) => sum + row.metrics.latencyMs, 0) / rows.length;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Gateways."
        description="Every gateway in the registry — one API surface over many providers. Sort, filter, and open a row for install instructions and sample usage."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Gateways" value={rows.length} delta={global.deltaPct} />
        <KpiCard
          label="Avg latency"
          value={formatLatency(Math.round(avgLatency))}
        />
        <KpiCard
          label="Total requests"
          value={formatRequests(global.requests)}
          spark={global.trend}
          delta={global.deltaPct}
        />
      </div>

      <div className="mt-8">
        <GatewayDirectory
          rows={rows}
          developers={getGatewayDevelopers()}
          tags={getGatewayTags()}
        />
      </div>
    </div>
  );
}
