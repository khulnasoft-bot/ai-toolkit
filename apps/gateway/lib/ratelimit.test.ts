import { describe, expect, it } from 'vitest';
import { RateLimiter } from './ratelimit';

describe('RateLimiter', () => {
  it('allows up to the limit then rejects', () => {
    const limiter = new RateLimiter({ windowMs: 60_000, maxRequests: 2 });
    expect(limiter.check('k', 0).allowed).toBe(true);
    const second = limiter.check('k', 1000);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
    const third = limiter.check('k', 2000);
    expect(third.allowed).toBe(false);
    expect(third.resetMs).toBe(60_000);
  });

  it('slides the window', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    expect(limiter.check('k', 0).allowed).toBe(true);
    expect(limiter.check('k', 500).allowed).toBe(false);
    expect(limiter.check('k', 1001).allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    const limiter = new RateLimiter({ windowMs: 60_000, maxRequests: 1 });
    expect(limiter.check('a', 0).allowed).toBe(true);
    expect(limiter.check('b', 0).allowed).toBe(true);
    expect(limiter.check('a', 0).allowed).toBe(false);
  });
});
