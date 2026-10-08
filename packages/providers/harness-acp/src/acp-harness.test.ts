import { describe, expect, it } from 'vitest';
import { createACP } from './acp-harness';
import { HarnessACPCapabilityUnsupportedError } from './acp-error';
import { getSourceIdentity } from './acp-source';

const base = {
  source: {
    type: 'npm-simple',
    packageName: '@agentclientprotocol/codex-acp',
    packageVersion: '1.1.4',
  },
  executable: 'codex-acp',
  modelMapping: { type: 'session-config-option', path: 'model' },
} as const;

describe('createACP', () => {
  it('creates a v1 harness with defaults', () => {
    const harness = createACP({ ...base, harnessId: 'acp-codex' });
    expect(harness.kind).toBe('acp');
    expect(harness.version).toBe('v1');
    expect(harness.options.hostToolMcpTransport).toBe('stdio');
    expect(harness.options.skillsDirectory).toBe('.agents/skills');
    expect(harness.options.startupTimeoutMs).toBe(120_000);
    expect(harness.clientAppId).toMatch(/^ai-toolkit\/harness-acp\//);
    expect(harness.getBootstrapIdentity()).toContain('harness:acp-codex');
  });

  it('rejects invalid harnessId / version / executable', () => {
    expect(() => createACP({ ...base, harnessId: 'Bad_ID' })).toThrow();
    expect(() =>
      createACP({ ...base, harnessId: 'acp-x', version: 'v9' as never }),
    ).toThrow();
    expect(() =>
      createACP({ ...base, harnessId: 'acp-x', executable: './bad' }),
    ).toThrow();
  });

  it('resolves permission modes and throws on null mappings', () => {
    const harness = createACP({
      ...base,
      harnessId: 'acp-codex',
      permissionModeMapping: {
        'allow-reads': null,
        'allow-edits': null,
        'allow-all': { type: 'session-mode', modeId: 'agent-full-access' },
      },
    });
    expect(harness.resolvePermissionMode('allow-all')).toEqual({
      type: 'session-mode',
      modeId: 'agent-full-access',
    });
    expect(() => harness.resolvePermissionMode('allow-reads')).toThrow(
      HarnessACPCapabilityUnsupportedError,
    );
  });

  it('resolves gateway placeholders with ensureSuffix', () => {
    const harness = createACP({
      ...base,
      harnessId: 'acp-codex',
      providerAuthentication: {
        gateway: {
          env: {
            BASE: { $source: 'gateway-base-url', ensureSuffix: '/v1' },
            KEY: { $source: 'gateway-api-key' },
            APP: { $source: 'client-app' },
          },
        },
      },
    });
    expect(
      harness.resolveGatewayEnv({
        apiKey: 'gw-key',
        baseUrl: 'https://gateway.example.com',
      }),
    ).toMatchObject({
      BASE: 'https://gateway.example.com/v1',
      KEY: 'gw-key',
    });
  });
});

describe('getSourceIdentity', () => {
  it('omits unpinned versions from identity', () => {
    expect(getSourceIdentity({ type: 'npm-simple', packageName: 'pkg' })).toBe(
      'pkg',
    );
    expect(
      getSourceIdentity({
        type: 'npm-simple',
        packageName: 'pkg',
        packageVersion: '1.0.0',
      }),
    ).toBe('pkg@1.0.0');
  });
});
