import type { Metric } from './types';

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randFor(key: string): () => number {
  return mulberry32(hashString(key));
}

export function formatRequests(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

export function formatCost(value: number): string {
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(2)}`;
}

export function formatLatency(value: number): string {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}s`;
  return `${value}ms`;
}

/**
 * Deterministic, seed-derived metrics for static rendering. Values are mock
 * data — a real backend can replace metricFor later without touching pages.
 */
export function metricFor(key: string): Metric {
  const rand = randFor(key);
  const requests = Math.round(50_000 + rand() * 950_000);
  const latencyMs = Math.round(300 + rand() * 1_800);
  const p99Ms = Math.round(latencyMs * (2 + rand() * 1.6));
  const costUsd = Math.round(requests * (0.0001 + rand() * 0.0003) * 100) / 100;
  const uptimePct = Math.round((99 + rand() * 0.95) * 100) / 100;
  const deltaPct = Math.round((rand() * 18 - 3) * 10) / 10;

  const trend = Array.from({ length: 30 }, (_, index) => {
    const weekly = 1 + Math.sin((index / 7) * Math.PI) * 0.18;
    const noise = 0.82 + rand() * 0.36;
    return Math.round((requests / 30) * weekly * noise);
  });

  return { requests, costUsd, latencyMs, p99Ms, uptimePct, trend, deltaPct };
}
