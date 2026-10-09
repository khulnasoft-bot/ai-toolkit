---
'@ai-toolkit/gateway-router': patch
'@ai-toolkit/observability-cost': patch
'@ai-toolkit/security-auth': patch
---

Add Phase 0 gateway platform contracts (additive, no breaking changes):

- `@ai-toolkit/gateway-router`: model routing contracts (`RoutingPolicy`,
  `ModelRoute`, `ProviderRoute`) with exact/prefix-wildcard/catch-all matching,
  `ordered`/`weighted`/`latency` strategies, retry budgets, policy fallback, plus
  pure `resolveRoute`, `matchModelPattern`, and `validatePolicy` helpers.
- `@ai-toolkit/observability-cost`: versioned `PriceTable` with a validating
  `loadPriceTable` JSON loader and `priceUsage` per-1k input/output pricing.
  Models without a matching entry report `priced: false` instead of a silent $0.
- `@ai-toolkit/security-auth`: `ak_<id>_<secret>` API keys with scrypt-hashed
  storage, `KeyStore` boundary (`InMemoryKeyStore` included), and `validateKey`
  enforcing revocation/expiry with typed errors, returning the downstream
  `KeyContext`.
