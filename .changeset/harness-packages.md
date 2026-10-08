---
'@ai-toolkit/harness': major
'@ai-toolkit/harness-claude-code': major
'@ai-toolkit/harness-cline': major
'@ai-toolkit/harness-codex': major
'@ai-toolkit/harness-cursor': major
'@ai-toolkit/harness-grok-build': major
'@ai-toolkit/harness-opencode': major
'@ai-toolkit/harness-pi': major
---

Add per-agent harness packages built on `@ai-toolkit/harness-acp` for connecting `HarnessAgent` to ACP v1 runtimes.

- `@ai-toolkit/harness`: shared base contracts (`HarnessPermissionMode`, `Harness` identity, `HarnessCapabilityUnsupportedError`).
- `@ai-toolkit/harness-claude-code`: `claudeCodeHarness` (`acp-claude-code`, `@agentclientprotocol/claude-agent-acp`, direct auth via `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN`, AI Gateway via Anthropic-compatible root URL).
- `@ai-toolkit/harness-codex`: `codexHarness` (`acp-codex`, `@agentclientprotocol/codex-acp`, only `allow-all`).
- `@ai-toolkit/harness-cursor`: `cursorHarness` (`cursor-acp`, Cursor CLI Bash installer, `agent --disable-auto-update acp`).
- `@ai-toolkit/harness-grok-build`: `grokBuildHarness` (`acp-grok-build`, `@xai-official/grok`, `grok agent stdio`).
- `@ai-toolkit/harness-cline`: `clineHarness` (`acp-cline`, `cline --acp`, auth via `cline auth`).
- `@ai-toolkit/harness-opencode`: `opencodeHarness` (`acp-opencode`, `opencode acp`).
- `@ai-toolkit/harness-pi`: `piHarness` (`acp-pi`, `pi-acp` adapter over stdio).
