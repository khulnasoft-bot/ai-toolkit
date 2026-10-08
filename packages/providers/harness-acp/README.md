# AI TOOLKIT - ACP Harness Adapter

The **ACP harness adapter** (`@ai-toolkit/harness-acp`) connects `HarnessAgent` to any harness compatible with **ACP version 1**. The generic adapter owns the bridge, ACP client, host-tool relay, event translation, approvals, and lifecycle behavior; the inline profile describes how to install and configure one ACP runtime.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-acp
```

## Usage

Define an ACP harness profile and pass it to `HarnessAgent`:

```ts
import { codexACPHarness } from '@ai-toolkit/harness-acp';

// const agent = new HarnessAgent({ harness: codexACPHarness, sandbox });
```

Or define a custom profile:

```ts
import { createACP } from '@ai-toolkit/harness-acp';

export const myHarness = createACP({
  harnessId: 'acp-my-agent',
  source: {
    type: 'npm-simple',
    packageName: '@agentclientprotocol/codex-acp',
    packageVersion: '1.1.4',
  },
  executable: 'codex-acp',
  modelMapping: { type: 'session-config-option', path: 'model' },
});
```

## Built-in profiles

- `claudeCodeACPHarness` — `@agentclientprotocol/claude-agent-acp`
- `codexACPHarness` — `@agentclientprotocol/codex-acp` (only `allow-all`)
- `cursorACPHarness` — Cursor CLI via install command (`agent --disable-auto-update acp`)
- `grokBuildACPHarness` — `@xai-official/grok` (`grok agent stdio`)

## Documentation

See `content/providers/` for the full harness guide. Known ACP v1 limitations: no model-step boundaries/usage, no portable compaction/steering, no portable built-in tool filtering.
