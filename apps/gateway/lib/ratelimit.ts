/**
 * In-memory sliding-window rate limiter, keyed by API key ID.
 *
 * Single-process only: each server instance tracks its own windows. For
 * multi-instance deployments, replace with a shared store behind the same
 * shape (`check` in, verdict out).
 */

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  readonly windowMs: number;
  /** Requests allowed per window per key. */
  readonly maxRequests: number;
}

export interface RateLimitVerdict {
  readonly allowed: boolean;
  readonly remaining: number;
  /** Epoch millis when the current window ends. */
  readonly resetMs: number;
}

export const DEFAULT_RATE_LIMIT: RateLimitOptions = {
  windowMs: 60_000,
  maxRequests: 120,
};

export function rateLimitFromEnv(): RateLimitOptions {
  const perMin = Number(process.env.GATEWAY_RATE_LIMIT_PER_MIN);
  return {
    windowMs: DEFAULT_RATE_LIMIT.windowMs,
    maxRequests:
      Number.isFinite(perMin) && perMin > 0
        ? Math.floor(perMin)
        : DEFAULT_RATE_LIMIT.maxRequests,
  };
}

export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly options: RateLimitOptions = DEFAULT_RATE_LIMIT,
  ) {}

  check(keyId: string, now: number = Date.now()): RateLimitVerdict {
    const cutoff = now - this.options.windowMs;
    const recent = (this.hits.get(keyId) ?? []).filter(t => t > cutoff);
    if (recent.length >= this.options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetMs: recent[0] + this.options.windowMs,
      };
    }
    recent.push(now);
    this.hits.set(keyId, recent);
    return {
      allowed: true,
      remaining: this.options.maxRequests - recent.length,
      resetMs: recent[0] + this.options.windowMs,
    };
  }

  reset(keyId?: string): void {
    if (keyId === undefined) {
      this.hits.clear();
    } else {
      this.hits.delete(keyId);
    }
  }
}
