import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * Cursor ACP harness profile. Installs the Cursor CLI with a Bash
 * installer and exposes ACP via `agent acp`.
 */
export const cursorHarness = createACP({
  harnessId: 'cursor-acp',
  source: {
    type: 'install-command',
    command: 'curl https://cursor.com/install -fsS | bash',
  },
  executable: 'agent',
  args: ['--disable-auto-update', 'acp'],
  modelMapping: { type: 'session-config-option', path: 'model' },
  clientCapabilities: { _meta: { parameterizedModelPicker: true } },
  credentialEnv: ['CURSOR_API_KEY'],
  credentialBrokering: ({ env, sandboxEnv }) => {
    if (!env.CURSOR_API_KEY || !sandboxEnv?.CURSOR_API_KEY) return [];
    return [
      {
        match: {
          host: 'api2.cursor.sh',
          headers: { Authorization: `Bearer ${sandboxEnv.CURSOR_API_KEY}` },
        },
        transform: {
          headers: { Authorization: `Bearer ${env.CURSOR_API_KEY}` },
        },
      },
    ];
  },
  clientApp: { name: 'ai-toolkit/harness-cursor', version: VERSION },
});
