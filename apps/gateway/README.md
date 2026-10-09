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
  (`resolveCandidates`). The executor (`lib/executor.ts`) walks the ordered
  candidates and fails over on retryable errors (429/5xx/timeouts, see
  `classifyFailure`) — but only before the first chunk is streamed. After
  streaming starts, errors propagate to the client. Config errors (missing
  credentials) fail fast with a JSON 502. Policy edits reload without restart.
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

## Deploy

Import the repo in Vercel, set **Root Directory** to `apps/gateway`.
`apps/gateway/vercel.json` scopes install/build to this app and its workspace
dependencies. Add provider credentials (`OPENAI_API_KEY`, …) as environment
variables. The playground talks to it via `AI_GATEWAY_URL` + `AI_GATEWAY_API_KEY`
(see `examples/04-tools/playground/.env.example`).
