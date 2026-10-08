# AI TOOLKIT - Claude Code Harness

The **Claude Code harness** (`@ai-toolkit/harness-claude-code`) connects `HarnessAgent` to Claude Code via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-claude-code
```

## Usage

```ts
import { claudeCodeHarness } from '@ai-toolkit/harness-claude-code';

// const agent = new HarnessAgent({ harness: claudeCodeHarness, sandbox });
```

## Details

- Source: `@agentclientprotocol/claude-agent-acp`
- Executable: `claude-agent-acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
