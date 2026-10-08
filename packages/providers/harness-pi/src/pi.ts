import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * Pi ACP harness profile (`pi-acp` over stdio).
 *
 * Installs the community `pi-acp` ACP adapter from npm, which embeds
 * the pi coding agent and exposes ACP v1 over stdio.
 */
export const piHarness = createACP({
  harnessId: 'acp-pi',
  source: { type: 'npm-simple', packageName: 'pi-acp' },
  executable: 'pi-acp',
  modelMapping: { type: 'session-config-option', path: 'model' },
  clientApp: { name: 'ai-toolkit/harness-pi', version: VERSION },
});
