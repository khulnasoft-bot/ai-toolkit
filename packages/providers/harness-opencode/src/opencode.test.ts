import { describe, expect, it } from 'vitest';
import { opencodeHarness } from './opencode';

describe('opencodeHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(opencodeHarness.kind).toBe('acp');
    expect(opencodeHarness.version).toBe('v1');
    expect(opencodeHarness.getBootstrapIdentity()).toContain(
      `harness:${opencodeHarness.harnessId}`,
    );
    expect(opencodeHarness.clientAppId).toContain(
      'ai-toolkit/harness-opencode',
    );
  });
});
