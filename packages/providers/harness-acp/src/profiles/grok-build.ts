import { createACP } from '../acp-harness';

/**
 * Grok Build ACP harness profile (`grok agent stdio`).
 * No `permissionModeMapping`: Grok Build handles safe operations
 * internally and permission requests fall back to tool-kind behavior.
 */
export const grokBuildACPHarness = createACP({
  harnessId: 'acp-grok-build',
  source: {
    type: 'npm-simple',
    packageName: '@xai-official/grok',
    packageVersion: '0.2.111',
  },
  executable: 'grok',
  args: ['agent', 'stdio'],
  modelMapping: { type: 'session-model', path: 'modelId' },
  credentialEnv: ['XAI_API_KEY'],
  credentialBrokering: ({ env, sandboxEnv }) => {
    if (!env.XAI_API_KEY || !sandboxEnv?.XAI_API_KEY) return [];
    return [
      {
        match: {
          url: env.GROK_XAI_API_BASE_URL ?? 'https://api.x.ai/v1',
          headers: { Authorization: `Bearer ${sandboxEnv.XAI_API_KEY}` },
        },
        transform: { headers: { Authorization: `Bearer ${env.XAI_API_KEY}` } },
      },
    ];
  },
  instructionMapping: { type: 'filesystem', path: '.grok/AGENTS.md' },
  providerAuthentication: {
    gateway: {
      env: {
        GROK_CLIENT_NAME: { $source: 'client-app-name' },
        GROK_CLIENT_VERSION: { $source: 'client-app-version' },
        XAI_API_KEY: { $source: 'gateway-api-key' },
        GROK_XAI_API_BASE_URL: {
          $source: 'gateway-base-url',
          ensureSuffix: '/v1',
        },
        GROK_MODELS_BASE_URL: {
          $source: 'gateway-base-url',
          ensureSuffix: '/v1',
        },
      },
    },
  },
});
