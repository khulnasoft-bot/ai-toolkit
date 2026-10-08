import { APICallError } from '@ai-toolkit/provider';
import { isAbortError } from './is-abort-error';

const FETCH_FAILED_ERROR_MESSAGES = ['fetch failed', 'failed to fetch'];

// Error codes that indicate a transient connection problem. They can appear
// directly on the fetch error (e.g. Bun) or nested in the `cause` chain
// (e.g. Undici socket errors in Node.js).
const RETRYABLE_ERROR_CODES = new Set([
  'UND_ERR_SOCKET',
  'ECONNRESET',
  'ECONNREFUSED',
  'ConnectionRefused',
  'ConnectionClosed',
  'FailedToOpenSocket',
]);

const MAX_CAUSE_DEPTH = 10;

function isRetryableConnectionError(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current = error;

  while (current != null && !seen.has(current) && seen.size < MAX_CAUSE_DEPTH) {
    seen.add(current);

    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string' && RETRYABLE_ERROR_CODES.has(code)) {
      return true;
    }

    current = (current as { cause?: unknown }).cause;
  }

  return false;
}

export function handleFetchError({
  error,
  url,
  requestBodyValues,
}: {
  error: unknown;
  url: string;
  requestBodyValues: unknown;
}) {
  if (isAbortError(error)) {
    return error;
  }

  // unwrap original error when fetch failed (for easier debugging):
  if (
    error instanceof TypeError &&
    FETCH_FAILED_ERROR_MESSAGES.includes(error.message.toLowerCase())
  ) {
    const cause = (error as any).cause;

    if (cause != null) {
      // Failed to connect to server:
      return new APICallError({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true, // retry when network error
      });
    }
  }

  if (isRetryableConnectionError(error)) {
    // keep the original error information and mark it as retryable:
    if (APICallError.isInstance(error)) {
      return new APICallError({
        message: error.message,
        cause: error.cause,
        url: error.url ?? url,
        requestBodyValues: error.requestBodyValues ?? requestBodyValues,
        statusCode: error.statusCode,
        responseHeaders: error.responseHeaders,
        responseBody: error.responseBody,
        data: error.data,
        isRetryable: true,
      });
    }

    return new APICallError({
      message: `Cannot connect to API: ${
        error instanceof Error ? error.message : 'connection error'
      }`,
      cause: error,
      url,
      requestBodyValues,
      isRetryable: true, // retry when network error
    });
  }

  return error;
}
