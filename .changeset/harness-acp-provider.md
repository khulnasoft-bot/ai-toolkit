---
'@ai-toolkit/harness-acp': major
---

Add the ACP harness adapter (`@ai-toolkit/harness-acp`) with `createACP()` for connecting `HarnessAgent` to ACP v1 runtimes.

- `createACP()` defines a harness profile (`harnessId`, `source`, `executable`, `modelMapping`, auth, permission modes, gateway env placeholders).
- Sources: `npm-simple` (optionally pinned), `npm-locked` (frozen lockfile install), `install-command` (trusted Bash installer into `$HOME/.local/bin`).
- Auth modes `auto` / `direct` / `ai-gateway` (or record); `providerAuthentication.gateway.env` placeholders (`gateway-api-key`, `gateway-base-url` + `ensureSuffix`, `gateway-authorization`, `client-app*`).
- Built-in profiles: `claudeCodeACPHarness`, `codexACPHarness` (only `allow-all`), `cursorACPHarness`, `grokBuildACPHarness`.
