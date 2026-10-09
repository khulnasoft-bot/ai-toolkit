import { describe, expect, it } from 'vitest';
import { classifyFailure } from './failure';

function statusError(statusCode: number): Error {
  const error = new Error(`request failed with status ${statusCode}`);
  (error as unknown as Record<string, unknown>).statusCode = statusCode;
  return error;
}

describe('classifyFailure', () => {
  it.each([408, 425, 429, 500, 502, 503, 504])(
    'retries status %i',
    statusCode => {
      expect(classifyFailure(statusError(statusCode))).toBe('retryable');
    },
  );

  it.each([400, 401, 403, 404, 422])('does not retry status %i', statusCode => {
    expect(classifyFailure(statusError(statusCode))).toBe('terminal');
  });

  it('reads alternate status shapes', () => {
    expect(classifyFailure({ status: 503 })).toBe('retryable');
    expect(classifyFailure({ response: { status: 429 } })).toBe('retryable');
    expect(classifyFailure({ response: { status: 400 } })).toBe('terminal');
  });

  it('retries timeouts and network errors', () => {
    const timeout = new Error('operation timed out');
    timeout.name = 'TimeoutError';
    expect(classifyFailure(timeout)).toBe('retryable');

    const reset = new Error('read ECONNRESET') as Error & { code: string };
    reset.code = 'ECONNRESET';
    expect(classifyFailure(reset)).toBe('retryable');

    expect(classifyFailure(new TypeError('fetch failed'))).toBe('retryable');
  });

  it('fails closed on unknown shapes', () => {
    expect(classifyFailure(new Error('boom'))).toBe('terminal');
    expect(classifyFailure('boom')).toBe('terminal');
    expect(classifyFailure(undefined)).toBe('terminal');
  });
});
