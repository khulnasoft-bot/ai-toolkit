import { metricFor } from './metrics';
import type { OverviewDeltas, OverviewMetrics } from './types';

export interface OverviewCounts {
  providers: number;
  models: number;
  gateways: number;
  tools: number;
}

export interface MetricsProvider {
  readonly name: string;
  overview(counts: OverviewCounts): OverviewMetrics | Promise<OverviewMetrics>;
}

const seededProvider: MetricsProvider = {
  name: 'seeded',
  overview(_counts: OverviewCounts): OverviewMetrics {
    const deltas: OverviewDeltas = {
      providers: metricFor('count:providers').deltaPct,
      models: metricFor('count:models').deltaPct,
      gateways: metricFor('count:gateways').deltaPct,
      tools: metricFor('count:tools').deltaPct,
    };
    return {
      provider: 'seeded',
      generatedAt: new Date().toISOString(),
      global: metricFor('global'),
      deltas,
    };
  },
};

/**
 * Metrics backend selector. `seeded` (the default) serves deterministic mock
 * data so the dashboard builds with no backend. To go live, add a provider
 * here and point STUDIO_METRICS_PROVIDER at it, e.g.:
 *
 *   STUDIO_METRICS_PROVIDER=warehouse
 *
 * A live provider implements the same `overview()` contract — typically by
 * querying the telemetry warehouse — and both the overview page (SSG
 * fallback) and /api/metrics/overview (rehydration) pick it up with no
 * page changes.
 */
export function getMetricsProvider(): MetricsProvider {
  const name = process.env.STUDIO_METRICS_PROVIDER ?? 'seeded';
  switch (name) {
    case 'seeded':
      return seededProvider;
    default:
      throw new Error(
        `Unknown metrics provider "${name}". Set STUDIO_METRICS_PROVIDER to a registered provider.`,
      );
  }
}

export async function getOverviewMetrics(
  counts: OverviewCounts,
): Promise<OverviewMetrics> {
  return getMetricsProvider().overview(counts);
}
