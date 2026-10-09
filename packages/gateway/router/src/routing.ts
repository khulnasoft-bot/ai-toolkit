/**
 * Model routing contracts for the AI Gateway platform.
 *
 * A {@link RoutingPolicy} maps model IDs to an ordered or weighted list of
 * provider endpoints. {@link resolveRoute} is a pure function: given a policy
 * and a model ID it returns the {@link RoutingDecision} the executor should
 * attempt first. Failover (advancing past the first provider) happens in the
 * executor, which uses `attemptsRemaining` as its retry budget.
 */

/** How the providers of a route are selected. */
export type RoutingStrategy = 'ordered' | 'weighted' | 'latency';

/** A single provider endpoint that can serve a model. */
export interface ProviderRoute {
  /** Provider identifier, e.g. `'openai'` or `'azure'`. */
  readonly provider: string;
  /** Provider-side model ID, e.g. `'gpt-4o'`. */
  readonly model: string;
  /** Relative weight for `'weighted'` strategy. Defaults to `1`. */
  readonly weight?: number;
}

/** Routing rule for the models matching `modelPattern`. */
export interface ModelRoute {
  /**
   * Exact model ID (`'openai/gpt-4o'`), prefix wildcard (`'openai/*'`),
   * or `'*'` for the catch-all. First matching route wins.
   */
  readonly modelPattern: string;
  /** Candidate providers in preference order. Must be non-empty. */
  readonly providers: readonly ProviderRoute[];
  /** Selection strategy. Defaults to `'ordered'`. */
  readonly strategy?: RoutingStrategy;
  /** Total attempts allowed for this model (initial + retries). Minimum `1`. */
  readonly retryBudget: number;
}

/** Versioned set of routing rules. */
export interface RoutingPolicy {
  readonly version: 1;
  readonly routes: readonly ModelRoute[];
  /** Used when no route matches. Absence means unroutable. */
  readonly fallback?: ProviderRoute;
}

/** First-attempt routing outcome for a model. */
export interface RoutingDecision {
  readonly provider: string;
  readonly model: string;
  /** Human-readable reason, e.g. `'route "openai/*" strategy ordered (attempt 1 of 3)'`. */
  readonly reason: string;
  /** Attempts the executor may make, including this one. */
  readonly attemptsRemaining: number;
  /** True when the decision came from the policy fallback. */
  readonly isFallback: boolean;
}

/**
 * Match a model ID against a pattern.
 *
 * - `'*'` matches everything.
 * - A trailing `'*'` (`'openai/*'`) matches the prefix.
 * - Anything else matches exactly.
 */
export function matchModelPattern(pattern: string, modelId: string): boolean {
  if (pattern === '*') return true;
  if (pattern.endsWith('*')) {
    return modelId.startsWith(pattern.slice(0, -1));
  }
  return pattern === modelId;
}

/**
 * Validate a policy without throwing. Returns a list of problems;
 * an empty list means the policy is usable.
 */
export function validatePolicy(policy: RoutingPolicy): string[] {
  const problems: string[] = [];
  if (policy.version !== 1) {
    problems.push(
      `unsupported policy version: ${JSON.stringify(policy.version)}`,
    );
  }
  policy.routes.forEach((route, index) => {
    const where = `routes[${index}] (${JSON.stringify(route.modelPattern)})`;
    if (route.providers.length === 0) {
      problems.push(`${where}: providers must be non-empty`);
    }
    if (!Number.isInteger(route.retryBudget) || route.retryBudget < 1) {
      problems.push(`${where}: retryBudget must be an integer >= 1`);
    }
    if (route.strategy === 'weighted') {
      route.providers.forEach((provider, providerIndex) => {
        const weight = provider.weight ?? 1;
        if (!(weight > 0)) {
          problems.push(
            `${where}: providers[${providerIndex}].weight must be > 0 for weighted strategy`,
          );
        }
      });
    }
  });
  return problems;
}

function pickProvider(
  route: ModelRoute,
  random: () => number,
): { provider: ProviderRoute; detail: string } {
  const strategy = route.strategy ?? 'ordered';
  if (strategy === 'weighted') {
    const total = route.providers.reduce((sum, p) => sum + (p.weight ?? 1), 0);
    let draw = random() * total;
    for (const provider of route.providers) {
      draw -= provider.weight ?? 1;
      if (draw < 0) {
        return { provider, detail: `weighted draw=${draw.toFixed(4)}` };
      }
    }
    const last = route.providers[route.providers.length - 1];
    return {
      provider: last,
      detail: 'weighted draw overflow, used last provider',
    };
  }
  // 'ordered' and 'latency' both start with the first provider; the executor
  // advances through the list on retryable failures.
  return {
    provider: route.providers[0],
    detail: `position 0 of ${route.providers.length}`,
  };
}

/**
 * Resolve the first routing decision for a model ID.
 *
 * Returns `undefined` when no route matches and the policy has no fallback.
 * `random` is injectable so weighted selection is deterministic in tests.
 */
export function resolveRoute(
  policy: RoutingPolicy,
  modelId: string,
  random: () => number = Math.random,
): RoutingDecision | undefined {
  for (const route of policy.routes) {
    if (!matchModelPattern(route.modelPattern, modelId)) continue;
    if (route.providers.length === 0) continue;
    const { provider, detail } = pickProvider(route, random);
    const strategy = route.strategy ?? 'ordered';
    return {
      provider: provider.provider,
      model: provider.model,
      reason: `route "${route.modelPattern}" strategy ${strategy} ${detail} (attempt 1 of ${route.retryBudget})`,
      attemptsRemaining: route.retryBudget,
      isFallback: false,
    };
  }
  if (policy.fallback) {
    return {
      provider: policy.fallback.provider,
      model: policy.fallback.model,
      reason: `no route matched "${modelId}", used policy fallback`,
      attemptsRemaining: 1,
      isFallback: true,
    };
  }
  return undefined;
}
