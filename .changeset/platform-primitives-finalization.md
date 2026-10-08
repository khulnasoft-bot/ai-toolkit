---
'@ai-toolkit/angular': patch
'@ai-toolkit/langchain': patch
'@ai-toolkit/llamaindex': patch
'@ai-toolkit/react': patch
'@ai-toolkit/rsc': patch
'@ai-toolkit/svelte': patch
'@ai-toolkit/vue': patch
'@ai-toolkit/provider-utils': patch
'@ai-toolkit/mcp': patch
'@ai-toolkit/amazon-bedrock': patch
'@ai-toolkit/anthropic': patch
'@ai-toolkit/assemblyai': patch
'@ai-toolkit/azure': patch
'@ai-toolkit/baseten': patch
'@ai-toolkit/black-forest-labs': patch
'@ai-toolkit/cerebras': patch
'@ai-toolkit/cohere': patch
'@ai-toolkit/deepgram': patch
'@ai-toolkit/deepinfra': patch
'@ai-toolkit/deepseek': patch
'@ai-toolkit/elevenlabs': patch
'@ai-toolkit/fal': patch
'@ai-toolkit/fireworks': patch
'@ai-toolkit/gladia': patch
'@ai-toolkit/google': patch
'@ai-toolkit/groq': patch
'@ai-toolkit/huggingface': patch
'@ai-toolkit/hume': patch
'@ai-toolkit/lmnt': patch
'@ai-toolkit/luma': patch
'@ai-toolkit/mistral': patch
'@ai-toolkit/openai-compatible': patch
'@ai-toolkit/openai': patch
'@ai-toolkit/perplexity': patch
'@ai-toolkit/prodia': patch
'@ai-toolkit/replicate': patch
'@ai-toolkit/revai': patch
'@ai-toolkit/togetherai': patch
'@ai-toolkit/xai': patch
'@ai-toolkit/codemod': patch
'@ai-toolkit/gateway': patch
'@ai-toolkit/khulnasoft': patch
'@ai-toolkit/provider': patch
'@ai-toolkit/valibot': patch
---

Complete the platform-primitives migration (PLATFORM_PRIMITIVES_PLAN.md):

- Move `packages/langchain` and `packages/llamaindex` → `packages/adapters/` (final migration wave; zero legacy packages remain) and remove the legacy `packages/*` workspace glob.
- Add the missing `default` export condition across all dual-build packages (plus `import` for `@ai-toolkit/svelte` and a `./package.json` export for bin-only `@ai-toolkit/codemod`), per ADR-006.
- Mark `@ai-toolkit/test-server` as private to match its `internal` stability label.
- Backport docs-site fixes (anchors, images, Elements nav) from `apps/docs/content` into canonical `content/`.
