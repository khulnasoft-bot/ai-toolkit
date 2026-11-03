# Platform Architecture Plan

**Goal**: Create a single source of truth for catalog data (providers, models, gateways, tools, templates, recipes, content) behind a versioned platform API, eliminating app-local catalog types across docs/www/studio.

**Status**: Phase 3 of ENHANCED_REFACTORING_STRUCTURE.md  
**Owner**: Architecture Team

---

## Overview

Today, provider/model/catalog parsing logic is duplicated across apps (www, gateway, docs). The platform package (`packages/foundation/platform`, `@ai-toolkit/platform`) already defines the contracts:

- `PlatformRecord` union (provider, model, gateway, tool, template, recipe, content)
- `PlatformRegistry` (list, all, get, search, validateRegistry)
- `createPlatformApi` (versioned `/api/platform/v1/` routes: catalog, collection, search, metrics/overview)
- `scripts/generate-registry.ts` (builds `build/platform-registry.json` from content/registry sources)

This plan executes the remaining steps to make the platform the canonical catalog source.

---

## P0: Contract and Inventory

**Goal**: Freeze app-local catalog types, create entity inventory, reserve API host.

### Tasks

1. **Freeze app-local catalog types**
   - Audit `apps/sites/www/lib/registry.ts` and `apps/sites/gateway/lib/catalog.ts` for local catalog types
   - Mark them as deprecated in favor of `@ai-toolkit/platform` types

2. **Create entity inventory**
   - Document all entity types: provider, model, gateway, tool, template, recipe, content
   - Map each to its source of truth (content/providers, content/gateways-registry, content/tools-registry, examples/registry.json, content/cookbook, packages/gateway/core/src)

3. **Reserve API host**
   - Reserve `api.ai-toolkit.dev` for the versioned platform API
   - Document versioning strategy (`/api/platform/v1/`)

### Deliverables

- Frozen app-local catalog types (deprecation notice)
- Entity inventory doc
- API host reservation note

---

## P1: Platform Package and Registry

**Goal**: Implement the platform package with schemas, validation, and registry snapshot generation.

### Tasks

1. **Implement `packages/foundation/platform`** (already exists)
   - Contracts: `PlatformRecord`, `PlatformRegistry`, `PlatformRegistrySnapshot`, `PlatformQuery`
   - Validation: `validateRegistry` (duplicate-id, invalid-id, missing-reference)
   - Query: `list`, `all`, `get`, `search`

2. **Add schemas and validation**
   - JSON Schema for `PlatformRegistrySnapshot`
   - Valibot/Zod schema for record validation
   - Export schema from package entry point

3. **Generate registry snapshot**
   - `pnpm --filter @ai-toolkit/platform generate-registry` writes `build/platform-registry.json`
   - Fix stale paths: `packages/core/gateway/src` → `packages/gateway/core/src` (gateway was relocated)
   - Add `--check` mode for CI (fail if snapshot is stale)

### Deliverables

- `@ai-toolkit/platform` package with contracts + validation
- `build/platform-registry.json` snapshot
- `generate-registry --check` CI mode

---

## P2: Query and Contract Hardening

**Goal**: Define typed queries, add DTO mappers, implement contract tests.

### Tasks

1. **Define typed queries**
   - Typed query builders for each entity type (providers, models, gateways, tools, templates, recipes, content)
   - Strongly typed search/filter parameters

2. **Add DTO mappers**
   - Map `PlatformRecordUnion` → app-facing DTOs (ProviderDTO, ModelDTO, etc.)
   - Keep DTOs separate from internal record types

3. **Implement contract tests**
   - Vitest tests for `validateRegistry` (duplicate id, invalid id prefix, missing provider reference)
   - Vitest tests for `PlatformRegistry` (list/all/get/search, limit clamping)
   - Vitest tests for `createPlatformApi` route handling (404, catalog, collection, search, metrics)

### Deliverables

- Typed query API
- DTO mapper functions
- Contract test suite (≥80% coverage on platform package)

---

## P3: API Boundary

**Goal**: Implement `/api/platform/v1` routes, OpenAPI spec, metrics API.

### Tasks

1. **Implement `/api/platform/v1` routes** (createPlatformApi already handles this)
   - `GET /api/platform/v1/catalog` — all records with query filtering
   - `GET /api/platform/v1/catalog/:type` — collection by type
   - `GET /api/platform/v1/search?q=` — full-text search
   - `GET /api/platform/v1/metrics/overview` — aggregated counts

2. **Add OpenAPI spec**
   - `apps/platform/openapi.yaml` (or `build/openapi/platform-openapi.json`)
   - Document all endpoints, query params, response shapes

3. **Implement metrics API**
   - Wire `getMetrics` callback in `createPlatformApi`
   - Expose provider/model/gateway/tool counts

### Deliverables

- Versioned platform API routes
- OpenAPI spec
- Metrics endpoint

---

## P4: Experience Migration

**Goal**: Migrate Studio/WWW/Docs readers to platform queries.

### Tasks

1. **Migrate Studio readers** — `@ai-toolkit/ui-studio` uses `@ai-toolkit/platform` queries
2. **Migrate WWW readers** — `apps/sites/www` uses platform catalog/types
3. **Migrate Docs adapters** — docs site uses platform content records

### Deliverables

- All three experiences consume `@ai-toolkit/platform`
- No app-local catalog types remain

---

## P5: Canonical Content and Cleanup

**Goal**: Unify content trees, remove duplicated logic, add CI checks.

### Tasks

1. **Unify content trees** — single source of truth under `content/`
2. **Remove duplicated logic** — delete app-local catalog parsing
3. **Add CI checks** — `pnpm arch:platform` validates registry snapshot is fresh

### Deliverables

- Single content source
- Zero duplicated catalog logic
- CI check passing

---

## Success Criteria

- Single source of truth for all catalog data
- All three experiences use platform queries
- API is versioned (`/api/platform/v1/`) and documented (OpenAPI)
- No data duplication across apps
- `pnpm arch:validate` passes

---

## Rollback

- Feature flags for gradual rollout
- Keep old readers as fallback during migration
- Registry snapshot is a generated file; safe to regenerate
