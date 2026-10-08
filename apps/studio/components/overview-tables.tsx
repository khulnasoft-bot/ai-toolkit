'use client';

import Link from 'next/link';
import { DataTable } from '@ai-toolkit/design/data-table';
import { StatusPill } from '@ai-toolkit/design/status-pill';
import { formatLatency, formatRequests } from '@/lib/metrics';
import type { GatewayRow } from '@/lib/gateways';
import type { ModelEntry, Metric } from '@/lib/types';
import type { Column } from '@ai-toolkit/design/data-table';

export type TopModel = ModelEntry & { metrics: Metric };

const modelColumns: Column<TopModel>[] = [
  {
    id: 'id',
    header: 'Model',
    cell: row => (
      <Link
        href="/models"
        className="font-mono text-[12px] text-foreground/90 hover:text-primary"
      >
        {row.id}
      </Link>
    ),
    sortValue: row => row.id,
  },
  {
    id: 'provider',
    header: 'Provider',
    cell: row => (
      <span className="text-muted-foreground">{row.providerName}</span>
    ),
    sortValue: row => row.providerName,
  },
  {
    id: 'modality',
    header: 'Modality',
    cell: row => (
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {row.modality}
      </span>
    ),
  },
  {
    id: 'latency',
    header: 'Latency',
    className: 'text-right',
    headerClassName: 'text-right',
    cell: row => (
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatLatency(row.metrics.latencyMs)}
      </span>
    ),
    sortValue: row => row.metrics.latencyMs,
  },
  {
    id: 'requests',
    header: 'Requests',
    className: 'text-right',
    headerClassName: 'text-right',
    cell: row => (
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatRequests(row.metrics.requests)}
      </span>
    ),
    sortValue: row => row.metrics.requests,
  },
];

const statusColumns: Column<GatewayRow>[] = [
  {
    id: 'name',
    header: 'Gateway',
    cell: row => (
      <Link href="/gateways" className="font-medium hover:text-primary">
        {row.name}
      </Link>
    ),
    sortValue: row => row.name,
  },
  {
    id: 'developer',
    header: 'Developer',
    cell: row => <span className="text-muted-foreground">{row.developer}</span>,
    sortValue: row => row.developer,
  },
  {
    id: 'status',
    header: 'Status',
    cell: row => <StatusPill status={row.status} />,
  },
  {
    id: 'latency',
    header: 'Latency',
    className: 'text-right',
    headerClassName: 'text-right',
    cell: row => (
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatLatency(row.metrics.latencyMs)}
      </span>
    ),
    sortValue: row => row.metrics.latencyMs,
  },
];

export function TopModelsTable({ rows }: { rows: TopModel[] }) {
  return (
    <DataTable
      data={rows}
      columns={modelColumns}
      getRowKey={row => row.id}
      emptyLabel="No models."
    />
  );
}

export function GatewayStatusTable({ rows }: { rows: GatewayRow[] }) {
  return (
    <DataTable
      data={rows.slice(0, 8)}
      columns={statusColumns}
      getRowKey={row => row.slug}
      emptyLabel="No gateways."
    />
  );
}
