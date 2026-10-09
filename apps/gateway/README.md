# AI Gateway (self-hosted)

One API key for every model, with provider routing and spend tracking.

## Endpoints

| Method & path    | Auth   | Description                                              |
| ---------------- | ------ | -------------------------------------------------------- |
| `POST /v1/chat`  | Bearer | Chat streaming (UIMessage SSE, same shape as playground) |
| `GET /v1/models` | —      | Public routing catalog                                   |

## Setup

```bash
cp .env.example .env.local   # add provider credentials (server-held)
pnpm keys:create --tenant acme
pnpm dev                     # http://localhost:3000
```

```bash
curl -N http://localhost:3000/v1/chat \
  -H "Authorization: Bearer <secret>" \
  -H 'Content-Type: application/json' \
  -d '{"model":"openai/gpt-4o-mini","messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Hi"}]}]}'
```

## How it works

- **One key**: `Authorization: Bearer ak_…` validated by `@ai-toolkit/security-auth`
  against `data/keys.json` (scrypt hashes only). Scopes enforced per route.
- **Routing**: `config/policy.json` → `@ai-toolkit/gateway-router`
  (`resolveRoute`). Phase 1 attempts the first provider; ordered failover
  arrives in Phase 2.
- **Spend**: every completed stream appends `{tenant, key, model, provider,
tokens, cost}` to `data/usage.jsonl`, priced via
  `@ai-toolkit/observability-cost` against `config/prices.json`.
  Unpriced models are flagged, never silently $0.

## Layout

```
apps/gateway/
├── app/v1/chat/route.ts    # key → route → streamText → ledger
├── app/v1/models/route.ts  # public catalog
├── lib/{keys,providers,config,ledger}.ts
├── config/{policy,prices}.json
└── scripts/create-key.ts    # pnpm keys:create
```

`data/` is gitignored. Swap `FileKeyStore` for a database behind the same
`KeyStore` interface for production.
