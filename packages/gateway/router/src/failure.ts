/**
 * Failure classification for gateway failover.
 *
 * The executor retries a failed attempt on the next provider only when the
 * failure is transient. Anything else (bad request, auth, config) is
 * terminal and surfaces to the client immediately. Client disconnects
 * (aborted signals) are never retried — that check lives in the executor.
 */

/** How the executor treats a failed attempt. */
export type FailureKind = 'retryable' | 'terminal';

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const RETRYABLE_CODES = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'EAI_AGAIN',
  'ENOTFOUND',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]);
const NETWORK_MESSAGE =
  /fetch failed|network|socket hang up|timeout|timed out|temporarily unavailable/i;

function readStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const record = error as Record<string, unknown>;
  for (const key of ['statusCode', 'status']) {
    const value = record[key];
    if (typeof value === 'number') return value;
  }
  const response = record['response'];
  if (typeof response === 'object' && response !== null) {
    const status = (response as Record<string, unknown>)['status'];
    if (typeof status === 'number') return status;
  }
  return undefined;
}

function readCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const code = (error as Record<string, unknown>)['code'];
  return typeof code === 'string' ? code : undefined;
}

/**
 * Classify an attempt failure. Retryable: rate limits, timeouts, 5xx, and
 * network errors. Everything else (including unknown shapes) is terminal —
 * failing closed beats retrying a request that will never succeed.
 */
export function classifyFailure(error: unknown): FailureKind {
  const status = readStatusCode(error);
  if (status !== undefined) {
    return RETRYABLE_STATUS.has(status) ? 'retryable' : 'terminal';
  }
  if (error instanceof Error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      // AbortError without a status is handled by the executor via the
      // signal; a bare AbortError here is treated as a timeout-ish failure.
      return 'retryable';
    }
    const code = readCode(error);
    if (code && RETRYABLE_CODES.has(code)) return 'retryable';
    if (NETWORK_MESSAGE.test(error.message)) return 'retryable';
  }
  return 'terminal';
}
