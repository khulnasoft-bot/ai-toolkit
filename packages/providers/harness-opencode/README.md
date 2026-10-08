# AI TOOLKIT - opencode Harness

The **opencode harness** (`@ai-toolkit/harness-opencode`) connects `HarnessAgent` to opencode via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-opencode
```

## Usage

```ts
import { opencodeHarness } from '@ai-toolkit/harness-opencode';

// const agent = new HarnessAgent({ harness: opencodeHarness, sandbox });
```

## Details

- Source: `opencode` (`opencode acp`)
- Executable: `opencode acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
