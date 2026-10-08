import { describe, expect, it } from 'vitest';
import { clineHarness } from './cline';

describe('clineHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(clineHarness.kind).toBe('acp');
    expect(clineHarness.version).toBe('v1');
    expect(clineHarness.getBootstrapIdentity()).toContain(
      `harness:${clineHarness.harnessId}`,
    );
    expect(clineHarness.clientAppId).toContain('ai-toolkit/harness-cline');
  });
});
