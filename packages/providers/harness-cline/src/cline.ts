import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * Cline ACP harness profile (`cline --acp`).
 *
 * Installs the `cline` CLI from npm and speaks ACP over stdio.
 * Auth is handled via `cline auth` (saved credentials reused
 * automatically); no credential env is forwarded by default.
 */
export const clineHarness = createACP({
  harnessId: 'acp-cline',
  source: { type: 'npm-simple', packageName: 'cline' },
  executable: 'cline',
  args: ['--acp'],
  modelMapping: { type: 'session-config-option', path: 'model' },
  clientApp: { name: 'ai-toolkit/harness-cline', version: VERSION },
});
