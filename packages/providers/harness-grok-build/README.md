# AI TOOLKIT - Grok Build Harness

The **Grok Build harness** (`@ai-toolkit/harness-grok-build`) connects `HarnessAgent` to Grok Build via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-grok-build
```

## Usage

```ts
import { grokBuildHarness } from '@ai-toolkit/harness-grok-build';

// const agent = new HarnessAgent({ harness: grokBuildHarness, sandbox });
```

## Details

- Source: `@xai-official/grok`
- Executable: `grok agent stdio`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
