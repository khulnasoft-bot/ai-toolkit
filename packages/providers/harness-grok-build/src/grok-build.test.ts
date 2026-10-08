import { describe, expect, it } from 'vitest';
import { grokBuildHarness } from './grok-build';

describe('grokBuildHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(grokBuildHarness.kind).toBe('acp');
    expect(grokBuildHarness.version).toBe('v1');
    expect(grokBuildHarness.getBootstrapIdentity()).toContain(
      `harness:${grokBuildHarness.harnessId}`,
    );
    expect(grokBuildHarness.clientAppId).toContain(
      'ai-toolkit/harness-grok-build',
    );
  });
});
