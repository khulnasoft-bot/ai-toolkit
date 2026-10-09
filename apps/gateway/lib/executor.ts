import type { UIMessageChunk } from '@ai-toolkit/ai';
import {
  classifyFailure,
  type FailureKind,
  type ProviderRoute,
} from '@ai-toolkit/gateway-router';

export interface AttemptFailure {
  readonly candidate: ProviderRoute;
  /** 1-based count of attempts used so far. */
  readonly attemptNumber: number;
  readonly kind: FailureKind;
  readonly error: unknown;
}

export interface FailoverOptions {
  /** Ordered candidates. The first entry is attempted first. */
  readonly candidates: readonly ProviderRoute[];
  /** Total attempts allowed, including the first. Capped to candidates. */
  readonly attemptsRemaining: number;
  /**
   * Start one attempt. May throw synchronously (config errors) or return a
   * chunk iterable that throws mid-stream (provider failures).
   */
  readonly startAttempt: (
    candidate: ProviderRoute,
  ) => AsyncIterable<UIMessageChunk> | Promise<AsyncIterable<UIMessageChunk>>;
  readonly classify?: (error: unknown) => FailureKind;
  readonly signal?: AbortSignal;
  readonly onAttemptFailure?: (failure: AttemptFailure) => void;
}

/**
 * Stream chunks from the first working candidate.
 *
 * Failover happens only while zero chunks have been forwarded: switching
 * providers mid-message would corrupt the UIMessage protocol. Once the
 * first chunk is out, errors propagate to the client. Aborted client
 * connections are never retried.
 */
export function streamWithFailover(
  options: FailoverOptions,
): ReadableStream<UIMessageChunk> {
  const { candidates, classify = classifyFailure, signal } = options;
  const budget = Math.max(
    1,
    Math.min(options.attemptsRemaining, candidates.length),
  );

  return new ReadableStream<UIMessageChunk>({
    async start(controller) {
      let used = 0;
      let lastError: unknown = new Error('no routing candidates available');
      for (
        let index = 0;
        index < candidates.length && used < budget;
        index += 1
      ) {
        const candidate = candidates[index];
        used += 1;
        let forwarded = false;
        try {
          const iterable = await options.startAttempt(candidate);
          for await (const chunk of iterable) {
            if (signal?.aborted) {
              return;
            }
            controller.enqueue(chunk);
            forwarded = true;
          }
          controller.close();
          return;
        } catch (error) {
          lastError = error;
          if (forwarded || signal?.aborted) {
            controller.error(error);
            return;
          }
          const kind = classify(error);
          options.onAttemptFailure?.({
            candidate,
            attemptNumber: used,
            kind,
            error,
          });
          if (
            kind !== 'retryable' ||
            used >= budget ||
            index + 1 >= candidates.length
          ) {
            controller.error(error);
            return;
          }
        }
      }
      controller.error(lastError);
    },
  });
}
