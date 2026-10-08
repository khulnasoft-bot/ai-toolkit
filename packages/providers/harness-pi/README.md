# AI TOOLKIT - Pi Harness

The **Pi harness** (`@ai-toolkit/harness-pi`) connects `HarnessAgent` to Pi via **ACP version 1**, built on `@ai-toolkit/harness-acp`.

> Experimental: expect breaking changes between releases.

## Setup

```bash
npm i @ai-toolkit/harness-pi
```

## Usage

```ts
import { piHarness } from '@ai-toolkit/harness-pi';

// const agent = new HarnessAgent({ harness: piHarness, sandbox });
```

## Details

- Source: `pi-acp` ACP adapter
- Executable: `pi-acp`
- Protocol: ACP v1 (`createACP` from `@ai-toolkit/harness-acp`)
