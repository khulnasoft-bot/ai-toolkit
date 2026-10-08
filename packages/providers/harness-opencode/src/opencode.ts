import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * opencode ACP harness profile (`opencode acp`).
 *
 * Installs the `opencode` CLI from npm and speaks ACP over stdio.
 * Supports session models via `session/set_model`.
 */
export const opencodeHarness = createACP({
  harnessId: 'acp-opencode',
  source: { type: 'npm-simple', packageName: 'opencode' },
  executable: 'opencode',
  args: ['acp'],
  modelMapping: { type: 'session-model', path: 'modelId' },
  clientApp: { name: 'ai-toolkit/harness-opencode', version: VERSION },
});
