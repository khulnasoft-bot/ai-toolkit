import type { UIMessageChunk } from '@ai-toolkit/ai';
import { describe, expect, it, vi } from 'vitest';
import { streamWithFailover } from './executor';

function chunk(text: string): UIMessageChunk {
  return { type: 'text-delta', delta: text } as unknown as UIMessageChunk;
}

async function* succeed(...texts: string[]): AsyncGenerator<UIMessageChunk> {
  for (const text of texts) {
    yield chunk(text);
  }
}

function statusError(statusCode: number): Error {
  const error = new Error(`status ${statusCode}`);
  (error as unknown as Record<string, unknown>).statusCode = statusCode;
  return error;
}

async function collect(
  stream: ReadableStream<UIMessageChunk>,
): Promise<unknown[]> {
  const out: unknown[] = [];
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return out;
      out.push((value as { delta?: string }).delta ?? value);
    }
  } finally {
    reader.releaseLock();
  }
}

const candidates = [
  { provider: 'openai', model: 'gpt-4o' },
  { provider: 'azure', model: 'gpt-4o' },
];

describe('streamWithFailover', () => {
  it('streams a successful first attempt', async () => {
    const start = vi.fn(async () => succeed('a', 'b'));
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 3,
      startAttempt: start,
    });
    await expect(collect(stream)).resolves.toEqual(['a', 'b']);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('fails over on retryable errors before the first chunk', async () => {
    const start = vi
      .fn()
      .mockRejectedValueOnce(statusError(429))
      .mockResolvedValueOnce(succeed('recovered'));
    const failures: unknown[] = [];
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 3,
      startAttempt: start,
      onAttemptFailure: failure => failures.push(failure),
    });
    await expect(collect(stream)).resolves.toEqual(['recovered']);
    expect(start).toHaveBeenCalledTimes(2);
    expect(failures).toHaveLength(1);
  });

  it('does not retry terminal errors', async () => {
    const start = vi.fn().mockRejectedValueOnce(statusError(401));
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 3,
      startAttempt: start,
    });
    await expect(collect(stream)).rejects.toThrow('status 401');
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('does not switch providers after the first chunk', async () => {
    async function* partial(): AsyncGenerator<UIMessageChunk> {
      yield chunk('partial');
      throw statusError(503);
    }
    const start = vi.fn().mockResolvedValueOnce(partial());
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 3,
      startAttempt: start,
    });
    const reader = stream.getReader();
    await expect(reader.read()).resolves.toMatchObject({ done: false });
    await expect(reader.read()).rejects.toThrow('status 503');
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('respects the attempt budget', async () => {
    const start = vi.fn().mockRejectedValue(statusError(503));
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 1,
      startAttempt: start,
    });
    await expect(collect(stream)).rejects.toThrow('status 503');
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('never retries aborted connections', async () => {
    const controller = new AbortController();
    controller.abort();
    const start = vi.fn().mockRejectedValueOnce(statusError(503));
    const stream = streamWithFailover({
      candidates,
      attemptsRemaining: 3,
      startAttempt: start,
      signal: controller.signal,
    });
    await expect(collect(stream)).rejects.toThrow('status 503');
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('errors when there are no candidates', async () => {
    const stream = streamWithFailover({
      candidates: [],
      attemptsRemaining: 3,
      startAttempt: vi.fn(),
    });
    await expect(collect(stream)).rejects.toThrow('no routing candidates');
  });
});
