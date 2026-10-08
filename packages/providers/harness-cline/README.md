# AI TOOLKIT - Cline Harness

The **Cline harness** (`@ai-toolkit/harness-cline`) connects `HarnessAgent` to Cline via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-cline
```

## Usage

```ts
import { clineHarness } from '@ai-toolkit/harness-cline';

// const agent = new HarnessAgent({ harness: clineHarness, sandbox });
```

## Details

- Source: `cline` (`cline --acp`)
- Executable: `cline --acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
