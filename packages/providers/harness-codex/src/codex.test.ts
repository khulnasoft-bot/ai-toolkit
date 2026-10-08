import { describe, expect, it } from 'vitest';
import { codexHarness } from './codex';

describe('codexHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(codexHarness.kind).toBe('acp');
    expect(codexHarness.version).toBe('v1');
    expect(codexHarness.getBootstrapIdentity()).toContain(
      `harness:${codexHarness.harnessId}`,
    );
    expect(codexHarness.clientAppId).toContain('ai-toolkit/harness-codex');
  });
});
