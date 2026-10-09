---
'@ai-toolkit/devtools': patch
'@ai-toolkit/design': patch
'@ai-toolkit/elements': patch
'@ai-toolkit/shadcn-ui': patch
'@ai-toolkit/ui-studio': patch
---

Fix repository validation checks: remove unused `@ai-toolkit/mcp` dependency from `@ai-toolkit/ui-studio`, use stable React keys in devtools viewer and `CodeBlock`, associate form labels with controls via `useId`, and document intentional `role="group"`/`"region"` ARIA patterns.
