import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PriceTable } from '@ai-toolkit/observability-cost';
import {
  resolveCandidates,
  type ProviderRoute,
  type RoutingPolicy,
  type ModelRoute,
} from '@ai-toolkit/gateway-router';
import { loadPolicy, loadPrices } from './config';

export interface RegistryModel {
  readonly id: string;
  readonly type: string;
  readonly context: string;
  readonly tags: readonly string[];
  readonly description: string;
}

export interface CatalogPrice {
  readonly inputPer1M: number;
  readonly outputPer1M: number;
  readonly currency: string;
}

export interface CatalogEntry extends RegistryModel {
  readonly providers: readonly ProviderRoute[];
  readonly strategy: string;
  readonly retryBudget: number;
  readonly routedViaFallback: boolean;
  readonly price: CatalogPrice | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Load and validate the model registry. Throws on malformed documents. */
export function loadRegistry(): RegistryModel[] {
  const raw = readFileSync(
    join(process.cwd(), 'config', 'models.json'),
    'utf-8',
  );
  const json: unknown = JSON.parse(raw);
  if (!isRecord(json) || !Array.isArray(json.models)) {
    throw new Error(
      'model registry must be a JSON object with a "models" array',
    );
  }
  return json.models.map((entry, index) => {
    const where = `models[${index}]`;
    if (!isRecord(entry))
      throw new Error(`registry ${where} must be an object`);
    if (typeof entry.id !== 'string' || !entry.id) {
      throw new Error(`registry ${where} "id" must be a non-empty string`);
    }
    if (typeof entry.type !== 'string' || !entry.type) {
      throw new Error(`registry ${where} "type" must be a non-empty string`);
    }
    if (typeof entry.context !== 'string' || !entry.context) {
      throw new Error(`registry ${where} "context" must be a non-empty string`);
    }
    if (
      !Array.isArray(entry.tags) ||
      !entry.tags.every(tag => typeof tag === 'string')
    ) {
      throw new Error(`registry ${where} "tags" must be an array of strings`);
    }
    if (typeof entry.description !== 'string' || !entry.description) {
      throw new Error(
        `registry ${where} "description" must be a non-empty string`,
      );
    }
    return {
      id: entry.id,
      type: entry.type,
      context: entry.context,
      tags: entry.tags as string[],
      description: entry.description,
    };
  });
}

function matchesPattern(pattern: string, modelId: string): boolean {
  if (pattern === '*') return true;
  if (pattern.endsWith('*')) return modelId.startsWith(pattern.slice(0, -1));
  return pattern === modelId;
}

function routeFor(
  policy: RoutingPolicy,
  modelId: string,
): ModelRoute | undefined {
  return policy.routes.find(
    route =>
      route.providers.length > 0 && matchesPattern(route.modelPattern, modelId),
  );
}

function priceFor(
  prices: PriceTable,
  pattern: string,
): { entry: CatalogPrice; priced: boolean } {
  for (const candidate of prices.entries) {
    if (!matchesPattern(candidate.modelPattern, pattern)) continue;
    return {
      entry: {
        inputPer1M: candidate.inputPer1k * 1000,
        outputPer1M: candidate.outputPer1k * 1000,
        currency: candidate.currency,
      },
      priced: true,
    };
  }
  return {
    entry: { inputPer1M: 0, outputPer1M: 0, currency: prices.currency },
    priced: false,
  };
}

/**
 * Merge the model registry with routing policy and prices into the public
 * catalog. Registry models with no matching route throw — a listed model
 * must be routable.
 */
export function loadCatalog(
  registry: RegistryModel[] = loadRegistry(),
  policy: RoutingPolicy = loadPolicy(),
  prices: PriceTable = loadPrices(),
): CatalogEntry[] {
  return registry.map(model => {
    const routed = resolveCandidates(policy, model.id);
    if (!routed) {
      throw new Error(`catalog model "${model.id}" matches no policy route`);
    }
    const price = priceFor(prices, model.id);
    return {
      ...model,
      providers: routed.candidates,
      strategy: routeFor(policy, model.id)?.strategy ?? 'ordered',
      retryBudget: routed.attemptsRemaining,
      routedViaFallback: routed.isFallback,
      price: price.priced ? price.entry : null,
    };
  });
}
