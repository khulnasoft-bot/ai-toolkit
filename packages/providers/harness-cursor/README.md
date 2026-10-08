# AI TOOLKIT - Cursor Harness

The **Cursor harness** (`@ai-toolkit/harness-cursor`) connects `HarnessAgent` to Cursor via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-cursor
```

## Usage

```ts
import { cursorHarness } from '@ai-toolkit/harness-cursor';

// const agent = new HarnessAgent({ harness: cursorHarness, sandbox });
```

## Details

- Source: Cursor CLI via install command
- Executable: `agent --disable-auto-update acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
