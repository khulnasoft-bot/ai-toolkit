import { describe, expect, it } from 'vitest';
import { cursorHarness } from './cursor';

describe('cursorHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(cursorHarness.kind).toBe('acp');
    expect(cursorHarness.version).toBe('v1');
    expect(cursorHarness.getBootstrapIdentity()).toContain(
      `harness:${cursorHarness.harnessId}`,
    );
    expect(cursorHarness.clientAppId).toContain('ai-toolkit/harness-cursor');
  });
});
