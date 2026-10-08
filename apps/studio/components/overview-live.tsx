'use client';

import { KpiCard } from '@ai-toolkit/design/kpi-card';
import { StatusPill } from '@ai-toolkit/design/status-pill';
import { useEffect, useState } from 'react';
import { formatCost, formatLatency, formatRequests } from '@/lib/metrics';
import type { OverviewCounts } from '@/lib/metrics-provider';
import type { OverviewMetrics } from '@/lib/types';

export function OverviewLive({
  fallback,
  counts,
}: {
  fallback: OverviewMetrics;
  counts: OverviewCounts;
}) {
  const [metrics, setMetrics] = useState(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function rehydrate() {
      try {
        const response = await fetch('/api/metrics/overview', {
          cache: 'no-store',
        });
        if (!response.ok) return;
        const payload = (await response.json()) as OverviewMetrics;
        if (!cancelled && payload?.global) {
          setMetrics(payload);
          setLive(true);
        }
      } catch {
        // keep the static fallback
      }
    }
    rehydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const { global, deltas } = metrics;

  return (
    <>
      <div className="mt-8 flex items-center gap-2">
        <StatusPill status={live ? 'live' : 'seeded'} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {live
            ? `live via ${metrics.provider}`
            : 'seeded snapshot · rehydrating'}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Providers"
          value={counts.providers}
          delta={deltas.providers}
        />
        <KpiCard label="Models" value={counts.models} delta={deltas.models} />
        <KpiCard
          label="Gateways"
          value={counts.gateways}
          delta={deltas.gateways}
        />
        <KpiCard label="Tools" value={counts.tools} delta={deltas.tools} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Requests"
          value={formatRequests(global.requests)}
          delta={global.deltaPct}
          spark={global.trend}
        />
        <KpiCard
          label="Cost"
          value={formatCost(global.costUsd)}
          delta={global.deltaPct}
        />
        <KpiCard label="Avg latency" value={formatLatency(global.latencyMs)} />
        <KpiCard
          label="Uptime"
          value={`${global.uptimePct}%`}
          sub="30-day window"
        />
      </div>
    </>
  );
}
