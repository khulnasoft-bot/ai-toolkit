import { describe, expect, it } from 'vitest';
import { piHarness } from './pi';

describe('piHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(piHarness.kind).toBe('acp');
    expect(piHarness.version).toBe('v1');
    expect(piHarness.getBootstrapIdentity()).toContain(
      `harness:${piHarness.harnessId}`,
    );
    expect(piHarness.clientAppId).toContain('ai-toolkit/harness-pi');
  });
});
