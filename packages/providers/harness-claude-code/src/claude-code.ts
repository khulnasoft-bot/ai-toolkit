import { createACP } from '@ai-toolkit/harness-acp';
import type { ACPCredentialRequestTransformation } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * Claude Code ACP harness profile.
 * Gateway uses the Anthropic-compatible root URL (no `/v1` suffix).
 * Direct auth uses `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN`.
 */
export const claudeCodeHarness = createACP({
  harnessId: 'acp-claude-code',
  source: {
    type: 'npm-simple',
    packageName: '@agentclientprotocol/claude-agent-acp',
    packageVersion: '0.61.0',
  },
  executable: 'claude-agent-acp',
  modelMapping: { type: 'session-config-option', path: 'model' },
  skillsDirectory: '.claude/skills',
  credentialEnv: ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN'],
  credentialBrokering: ({ env, sandboxEnv }) => {
    const transformations: ACPCredentialRequestTransformation[] = [];
    const baseUrl = env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com';
    if (env.ANTHROPIC_API_KEY && sandboxEnv?.ANTHROPIC_API_KEY) {
      transformations.push({
        match: {
          url: baseUrl,
          headers: { 'x-api-key': sandboxEnv.ANTHROPIC_API_KEY },
        },
        transform: { headers: { 'x-api-key': env.ANTHROPIC_API_KEY } },
      });
    }
    if (env.ANTHROPIC_AUTH_TOKEN && sandboxEnv?.ANTHROPIC_AUTH_TOKEN) {
      transformations.push({
        match: {
          url: baseUrl,
          headers: {
            Authorization: `Bearer ${sandboxEnv.ANTHROPIC_AUTH_TOKEN}`,
          },
        },
        transform: {
          headers: { Authorization: `Bearer ${env.ANTHROPIC_AUTH_TOKEN}` },
        },
      });
    }
    return transformations;
  },
  env: { IS_SANDBOX: '1' },
  instructionMapping: {
    type: 'session-meta',
    path: ['systemPrompt', 'append'],
  },
  permissionModeMapping: {
    'allow-reads': { type: 'session-mode', modeId: 'default' },
    'allow-edits': { type: 'session-mode', modeId: 'acceptEdits' },
    'allow-all': { type: 'session-mode', modeId: 'bypassPermissions' },
  },
  providerAuthentication: {
    gateway: {
      env: {
        ANTHROPIC_API_KEY: { $source: 'gateway-api-key' },
        ANTHROPIC_AUTH_TOKEN: { $source: 'gateway-api-key' },
        ANTHROPIC_BASE_URL: { $source: 'gateway-base-url' },
        CLAUDE_AGENT_SDK_CLIENT_APP: { $source: 'client-app' },
      },
    },
  },
  clientApp: { name: 'ai-toolkit/harness-claude-code', version: VERSION },
});
