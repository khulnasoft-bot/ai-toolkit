---
'ai-toolkit': major
'@ai-toolkit/react': patch
'@ai-toolkit/vue': patch
'@ai-toolkit/svelte': patch
'@ai-toolkit/angular': patch
'@ai-toolkit/rsc': patch
'@ai-toolkit/elements': patch
'@ai-toolkit/codemod': patch
'@ai-toolkit/devtools': patch
'@ai-toolkit/langchain': patch
'@ai-toolkit/llamaindex': patch
---

Rename the core SDK package `ai` → `ai-toolkit` and remove the `@ai-toolkit/ai` shim (`packages/core/ai`).

Migration for consumers:

```diff
- import { generateText } from 'ai';
+ import { generateText } from 'ai-toolkit';
```

- `ai/test` → `ai-toolkit/test`, `ai/internal` → `ai-toolkit/internal`.
- `@ai-toolkit/ai`, `@ai-toolkit/ai/test`, `@ai-toolkit/ai/internal` → `ai-toolkit`, `ai-toolkit/test`, `ai-toolkit/internal`.
- Run the codemod: `npx @ai-toolkit/codemod v6/rename-ai-to-ai-toolkit <path>`
  (also included in `upgrade` / `v6` bundles).
- Wire previously unwired public modules into the main entry: `upload-file`, `upload-skill`.
- Land the typed per-tool context feature: `Tool` gains `CONTEXT` type param + `contextSchema`, `tool()` infers context, `execute` receives `options.context`, new `toolsContext` option on `generateText` / `streamText` / agents (validated via `validateToolContext`, `experimental_context` kept as deprecated fallback).
- `batch`, `translate` remain unwired WIP: they depend on V4 model infrastructure (`resolveLanguageModel` V4, V4 prompt conversion, `resolveSpeechTranslationModel`) that does not exist yet.
- `realtime` remains unwired WIP: it needs function-valued tool `description`s, which requires design decisions in fingerprinting (`tool-fingerprint`) and `prepare-tools-and-tool-choice`.
- Fix `UploadFileResult` / `UploadSkillResult` warnings to `SharedV4Warning` (V4-native, matching `generate-video` precedent).
