import { describe, expect, it } from 'vitest';
import { claudeCodeHarness } from './claude-code';

describe('claudeCodeHarness', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(claudeCodeHarness.kind).toBe('acp');
    expect(claudeCodeHarness.version).toBe('v1');
    expect(claudeCodeHarness.getBootstrapIdentity()).toContain(
      `harness:${claudeCodeHarness.harnessId}`,
    );
    expect(claudeCodeHarness.clientAppId).toContain(
      'ai-toolkit/harness-claude-code',
    );
  });
});
