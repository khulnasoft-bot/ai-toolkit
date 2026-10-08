import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * Codex ACP harness profile. Supports only `permissionMode: 'allow-all'`.
 * The OpenAI-compatible endpoint must end in `/v1`.
 */
export const codexHarness = createACP({
  harnessId: 'acp-codex',
  source: {
    type: 'npm-simple',
    packageName: '@agentclientprotocol/codex-acp',
    packageVersion: '1.1.4',
  },
  executable: 'codex-acp',
  modelMapping: { type: 'session-config-option', path: 'model' },
  forwardEnv: ['CODEX_CONFIG'],
  credentialEnv: ['CODEX_API_KEY', 'OPENAI_API_KEY'],
  credentialBrokering: ({ env, sandboxEnv }) => {
    const name = env.CODEX_API_KEY ? 'CODEX_API_KEY' : 'OPENAI_API_KEY';
    const credential = env[name];
    const sandboxCredential = sandboxEnv?.[name];
    if (!credential || !sandboxCredential) return [];
    return [
      {
        match: { headers: { Authorization: `Bearer ${sandboxCredential}` } },
        transform: { headers: { Authorization: `Bearer ${credential}` } },
      },
    ];
  },
  instructionMapping: {
    type: 'launch-env-json',
    variable: 'CODEX_CONFIG',
    path: ['developer_instructions'],
  },
  permissionModeMapping: {
    'allow-reads': null,
    'allow-edits': null,
    'allow-all': { type: 'session-mode', modeId: 'agent-full-access' },
  },
  authentication: { methodId: 'api-key' },
  providerAuthentication: {
    gateway: {
      env: {
        CODEX_API_KEY: { $source: 'gateway-api-key' },
        CODEX_CONFIG: {
          model: 'openai/gpt-5.6-sol',
          model_provider: 'ai_gateway',
          model_providers: {
            ai_gateway: {
              name: 'AI Gateway',
              base_url: { $source: 'gateway-base-url', ensureSuffix: '/v1' },
              env_key: 'CODEX_API_KEY',
              wire_api: 'responses',
              supports_websockets: false,
              http_headers: {
                'User-Agent': { $source: 'client-app' },
                'x-client-app': { $source: 'client-app' },
              },
            },
          },
          model_supports_reasoning_summaries: true,
          preferred_auth_method: 'apikey',
        },
      },
    },
  },
  clientApp: { name: 'ai-toolkit/harness-codex', version: VERSION },
});
