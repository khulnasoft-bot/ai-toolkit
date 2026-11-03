# Apps Restructuring Plan

**Goal**: Consolidate docs/www/studio into a single `@ai-toolkit/apps` package with unified Next 16/React 19/Tailwind v4 stack, independent deployability preserved.

**Status**: Phase 0 complete (single `apps/package.json` created). Executing Phases 1-5.

---

## Current State

```
apps/
├── package.json          # @ai-toolkit/apps (private, dev script only)
├── www/                  # Next 16/React 19 website
└── gateway/              # Next 16/React 19 gateway app
```

Workspace configuration lists `apps`, `apps/www`, `apps/gateway` as separate workspaces.

---

## Target State

```
apps/
├── package.json          # @ai-toolkit/apps (unified manifest)
├── package.json          # (root workspace entry)
├── sites/
│   ├── www/              # Next 16/React 19/Tailwind v4 website
│   ├── docs/             # Next 16/React 19/Tailwind v4 documentation
│   └── gateway/          # Next 16/React 19/Tailwind v4 gateway
├── scripts/
│   ├── build.mjs         # Build orchestration
│   └── deploy.mjs        # Vercel deployment per site
├── vercel.json           # Root vercel config
└── vercel/               # Per-site vercel configs
    ├── www.json
    ├── docs.json
    └── gateway.json
```

---

## Phase 0: Create Single apps/package.json ✅ COMPLETE

- `apps/package.json` exists as `@ai-toolkit/apps` (private)
- Dev script: `pnpm --filter www dev`

---

## Phase 1: Rewire Workspace Configuration

**Goal**: Consolidate `apps/www` and `apps/gateway` into the single `@ai-toolkit/apps` workspace root.

**Tasks**:

1. Update `pnpm-workspace.yaml`:
   - Replace `- 'apps'`, `- 'apps/www'`, `- 'apps/gateway'` with a single entry for the consolidated apps structure
   - Keep `apps/*/*` for sites if using nested structure

2. Move `apps/www/` → `apps/sites/www/`
3. Move `apps/gateway/` → `apps/sites/gateway/`
4. Create `apps/sites/docs/` (documentation site)
5. Update workspace `package.json` scripts to build/deploy all sites

**Dependencies**: `@ai-toolkit/apps` becomes the single workspace entry for all apps.

---

## Phase 2: Implement Build Orchestration Scripts

**Goal**: Create scripts to build and deploy all sites from a single entry point.

**Tasks**:

1. Create `apps/scripts/build.mjs`:
   - Build all sites in sequence or parallel
   - Support `--filter` for individual site builds
   - Handle build errors with rollback

2. Create `apps/scripts/deploy.mjs`:
   - Deploy to Vercel per site
   - Independent deployability per site
   - Environment variable handling

3. Add scripts to `apps/package.json`:
   - `dev:www`, `dev:gateway`, `dev:docs`
   - `build:www`, `build:gateway`, `build:docs`
   - `deploy:www`, `deploy:gateway`, `deploy:docs`

---

## Phase 3: Update Vercel Deployment Configurations

**Goal**: Independent Vercel deployments per site from a single package.

**Tasks**:

1. Create `apps/vercel.json` (root)
2. Create `apps/vercel/www.json`, `apps/vercel/gateway.json`, `apps/vercel/docs.json`
3. Configure build commands per site
4. Configure output directories per site
5. Add domain mappings per site

---

## Phase 4: Migrate to Next 16/React 19/Tailwind v4

**Goal**: Unified stack across all sites.

**Tasks**:

1. `apps/www/` — Already on Next 16/React 19 (verify Tailwind v4)
2. `apps/gateway/` — Already on Next 16/React 19 (verify Tailwind v4)
3. `apps/docs/` — Create new Next 16/React 19/Tailwind v4 docs site
4. Unify dependency versions across all sites
5. Remove duplicate dependency declarations

---

## Phase 5: Cleanup and Validation

**Goal**: Verify the restructure works end-to-end.

**Tasks**:

1. All three sites build independently from `apps/package.json`
2. Deployment to Vercel works for each site independently
3. No regression in site performance or functionality
4. No breaking changes to public APIs
5. Update `ARCHITECTURE_QUICK_REFERENCE.md` with new apps structure

---

## Success Criteria

- All three sites build and run from single `@ai-toolkit/apps` package
- Deployment to Vercel works for each site independently
- No regression in site performance or functionality
- No breaking changes to public APIs
- Single unified Next 16/React 19/Tailwind v4 stack

---

## Rollback

- Revert `pnpm-workspace.yaml` to separate workspace entries
- Restore individual `package.json` files per app
- Revert directory moves (`apps/sites/*` → `apps/*`)
