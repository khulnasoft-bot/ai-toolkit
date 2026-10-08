# AI TOOLKIT - Codex Harness

The **Codex harness** (`@ai-toolkit/harness-codex`) connects `HarnessAgent` to Codex via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-codex
```

## Usage

```ts
import { codexHarness } from '@ai-toolkit/harness-codex';

// const agent = new HarnessAgent({ harness: codexHarness, sandbox });
```

## Details

- Source: `@agentclientprotocol/codex-acp` (only `allow-all`)
- Executable: `codex-acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
