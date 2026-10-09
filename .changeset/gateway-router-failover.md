---
'@ai-toolkit/gateway-router': patch
---

Add failover support (additive, no breaking changes):

- `classifyFailure` distinguishes retryable failures (429/408/5xx, timeouts,
  network errors) from terminal ones, failing closed on unknown shapes.
- `resolveCandidates` returns the full ordered provider list with retry budget
  for executors to fail over through.
