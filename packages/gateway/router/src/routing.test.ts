import { describe, expect, it } from 'vitest';
import {
  matchModelPattern,
  resolveRoute,
  validatePolicy,
  type RoutingPolicy,
} from './routing';

const policy: RoutingPolicy = {
  version: 1,
  routes: [
    {
      modelPattern: 'openai/gpt-4o',
      providers: [
        { provider: 'openai', model: 'gpt-4o' },
        { provider: 'azure', model: 'gpt-4o' },
      ],
      strategy: 'ordered',
      retryBudget: 3,
    },
    {
      modelPattern: 'anthropic/*',
      providers: [
        { provider: 'anthropic', model: 'claude-3-7-sonnet', weight: 3 },
        { provider: 'bedrock', model: 'claude-3-7-sonnet', weight: 1 },
      ],
      strategy: 'weighted',
      retryBudget: 2,
    },
  ],
  fallback: { provider: 'openai', model: 'gpt-4o-mini' },
};

describe('matchModelPattern', () => {
  it('matches exact IDs', () => {
    expect(matchModelPattern('openai/gpt-4o', 'openai/gpt-4o')).toBe(true);
    expect(matchModelPattern('openai/gpt-4o', 'openai/gpt-4o-mini')).toBe(
      false,
    );
  });

  it('matches prefix wildcards and catch-all', () => {
    expect(
      matchModelPattern('anthropic/*', 'anthropic/claude-3-7-sonnet'),
    ).toBe(true);
    expect(matchModelPattern('anthropic/*', 'openai/gpt-4o')).toBe(false);
    expect(matchModelPattern('*', 'anything/at-all')).toBe(true);
  });
});

describe('resolveRoute', () => {
  it('resolves the first provider of an ordered route', () => {
    const decision = resolveRoute(policy, 'openai/gpt-4o');
    expect(decision).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o',
      attemptsRemaining: 3,
      isFallback: false,
    });
    expect(decision?.reason).toContain('route "openai/gpt-4o"');
  });

  it('picks deterministically for weighted strategy with injected random', () => {
    // weights 3:1, total 4 — draw 0.1*4=0.4 hits the first provider.
    const first = resolveRoute(policy, 'anthropic/claude-x', () => 0.1);
    expect(first?.provider).toBe('anthropic');
    // draw 0.9*4=3.6 skips the first provider (3.6-3=0.6 >= 0).
    const second = resolveRoute(policy, 'anthropic/claude-x', () => 0.9);
    expect(second?.provider).toBe('bedrock');
  });

  it('uses the fallback when nothing matches', () => {
    const decision = resolveRoute(policy, 'unknown/model');
    expect(decision).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o-mini',
      attemptsRemaining: 1,
      isFallback: true,
    });
  });

  it('returns undefined without a fallback', () => {
    const withoutFallback: RoutingPolicy = {
      version: 1,
      routes: policy.routes,
    };
    expect(resolveRoute(withoutFallback, 'unknown/model')).toBeUndefined();
  });

  it('skips routes with empty providers', () => {
    const broken: RoutingPolicy = {
      version: 1,
      routes: [{ modelPattern: '*', providers: [], retryBudget: 1 }],
    };
    expect(resolveRoute(broken, 'openai/gpt-4o')).toBeUndefined();
  });
});

describe('validatePolicy', () => {
  it('accepts a valid policy', () => {
    expect(validatePolicy(policy)).toEqual([]);
  });

  it('reports empty providers, bad budgets, and bad weights', () => {
    const problems = validatePolicy({
      version: 1,
      routes: [
        { modelPattern: 'a', providers: [], retryBudget: 1 },
        {
          modelPattern: 'b',
          providers: [{ provider: 'p', model: 'm' }],
          retryBudget: 0,
        },
        {
          modelPattern: 'c',
          providers: [{ provider: 'p', model: 'm', weight: 0 }],
          strategy: 'weighted',
          retryBudget: 1,
        },
      ],
    });
    expect(problems).toHaveLength(3);
  });
});
