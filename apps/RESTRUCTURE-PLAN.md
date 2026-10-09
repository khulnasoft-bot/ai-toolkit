# apps/ Restructure Plan — consolidate docs + www + studio into ONE workspace package

> Goal: `apps/` becomes a single pnpm workspace package (`@ai-toolkit/apps`,
> one `apps/package.json`). The three sites stay as **sub-build dirs**
> (`apps/docs`, `apps/www`, `apps/studio`) that keep their own
> `next.config.*`, `tsconfig.json`, and `tailwind` setup so they remain
> independently deployable to Vercel with separate projects.
>
> Status: plan only — no code has been changed yet.

---

## 1. Current-state analysis

### 1.1 Inventory

|                 | `apps/docs`                                                                                    | `apps/www`                                                    | `apps/studio`                                                     |
| --------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Package         | `@ai-toolkit/docs`                                                                             | `@ai-toolkit/www`                                             | `@ai-toolkit/studio`                                              |
| Stack           | Next **16.3.3** / React **19.2** / Tailwind **v4** + Fumadocs + vendored `@ai-toolkit/ai-docs` | Next **15.5** / React **18** / Tailwind **v3**                | Next **15.5** / React **18** / Tailwind **v3**                    |
| Shared pkg deps | none (`@ai-toolkit/ai-docs`, fumadocs…)                                                        | `@ai-toolkit/design` (TW3 preset)                             | `@ai-toolkit/design` (TW3 preset)                                 |
| Content source  | own `apps/docs/content/**` (Geistdocs tree, `meta.json`, no numeric prefixes)                  | root `content/**` (numeric-prefixed)                          | root `content/**`                                                 |
| Routes          | `/[lang]/docs`, `/providers`, `/cookbook`, llms/agents/rss/api                                 | `/`, `/gateways`, `/providers`, `/resources/*`, `/playground` | `/`, `/gateways`, `/models`, `/providers`, `/tools`, `/templates` |
| File size       | ~617 files                                                                                     | ~54 files                                                     | ~38 files                                                         |

All three are `private: true`, unpublished → **no changeset required**.

### 1.2 Integration points that assume three packages

Every one of these must change or be verified in the merge:

1. `pnpm-workspace.yaml` → `- 'apps/*'` globs the three packages.
2. root `tsconfig.json` lines 193-199 reference `apps/docs`, `apps/studio`, `apps/www`.
3. `turbo.json` `build.outputs` already includes `.next/**` (relative to the task
   package root; after the merge that root becomes `apps/`, which still matches
   `.next/**` under all three subdirs).
4. Per-app `vercel.json` (`apps/{docs,www,studio}/vercel.json`) use
   `pnpm turbo build --filter=@ai-toolkit/<name>...` and
   `npx turbo-ignore @ai-toolkit/<name>...`. Filter names die with the manifests.
5. `tools/scripts/validate-structure.mjs:146` `collectPackageNames(apps, 'apps')`
   walks `apps/` recursively for `package.json` — still works, but expected set
   shrinks to one entry (also drives `build/inventory.json`).
6. `package.json` `postinstall: fumadocs-mdx` (docs) generates the gitignored
   `apps/docs/.source/`; must survive the move.

### 1.3 The hard constraint: one package = one dependency graph

A single `apps/package.json` can only install **one** version of `next`,
`react`, `react-dom`, `tailwindcss`, and `@types/react`,
but the three apps declare conflicting ones today:

| dep                    | docs                  | www / studio          | merged entry        |
| ---------------------- | --------------------- | --------------------- | ------------------- |
| `next`                 | `16.3.3`              | `^15.5.9`             | `16.3.3` (or `^16`) |
| `react`                | `^19.2.3`             | `^18`                 | `^19.2.3`           |
| `react-dom`            | `^19.2.3`             | `^18`                 | `^19.2.3`           |
| `@types/react` / `dom` | `^19.2.7` / `^19.2.3` | `^18`                 | `^19.x`             |
| `tailwindcss`          | `^4.1.17` (CSS-first) | `^3.4.15` (config.js) | `^4.1.17`           |

`@ai-toolkit/ai-docs` pegs `next ^16.3.3` and React 19 (docs **cannot**
downscope), so the merge **forces www + studio to migrate forward** to
Next 16 / React 19 / Tailwind v4. This is the biggest work item and is broken
out as Phase 4 below. Keeping both Next majors coexists only if the three dirs
remain separate workspace packages — which contradicts the "one package" goal.

---

## 2. Target architecture

```
apps/
├── package.json                # ONE workspace package: @ai-toolkit/apps (private)
├── tsconfig.json               # solution-style: references docs/www/studio tsconfigs
├── README.md                   # run book (new)
├── scripts/
│   ├── build-one.mjs           # next build for one site (cwd = the site dir)
│   ├── build-all.mjs           # sequential build of all three sites
│   ├── dev-all.mjs             # three `next dev` on distinct ports
│   ├── start-one.mjs           # next start for one site
│   └── vercel-ignore.mjs       # per-site changed-path check for deploy skips
├── docs/                       # @ai-toolkit/docs content+renderer — NO package.json
│   ├── next.config.ts  tsconfig.json  postcss.config.mjs  source.config.ts
│   ├── geistdocs.tsx  proxy.ts
│   ├── app/  components/  lib/  content/  public/  scripts/
├── www/                        # @ai-toolkit/www — NO package.json
│   ├── next.config.js  tsconfig.json  postcss.config.*  (tailwind v4 globals)
│   └── app/  components/  lib/
└── studio/                     # @ai-toolkit/studio — NO package.json
    ├── next.config.js  tsconfig.json  postcss.config.*  (tailwind v4 globals)
    └── app/  components/  lib/
```

Nothing moves physically — the three source trees stay in place. The change is
purely: **remove the three package.json files, add one `apps/package.json`
(plus thin scripts), and rewire workspace/deploy tooling.**

---

## 3. Phased implementation

### Phase 0 — Create the single package manifest

Create `apps/package.json` (prototype):

```jsonc
{
  "name": "@ai-toolkit/apps",
  "version": "0.0.0",
  "private": true,
  "description": "AI TOOLKIT sites (docs, www, studio) — single workspace package",
  "scripts": {
    "build": "node scripts/build-all.mjs",
    "build:docs": "node scripts/build-one.mjs docs",
    "build:www": "node scripts/build-one.mjs www",
    "build:studio": "node scripts/build-one.mjs studio",
    "dev": "node scripts/dev-all.mjs",
    "dev:docs": "next dev docs",
    "dev:www": "next dev www",
    "dev:studio": "next dev studio",
    "start": "node scripts/start-one.mjs all",
    "start:docs": "node scripts/start-one.mjs docs",
    "start:www": "node scripts/start-one.mjs www",
    "start:studio": "node scripts/start-one.mjs studio",
    "lint": "eslint \"./{docs,www,studio}/**/*.ts*\" --ignore-pattern \"*.tsbuildinfo\" --ignore-pattern \"**/.next/**\" --ignore-pattern \"**/dist/**\"",
    "type-check": "tsc -p docs/tsconfig.json --noEmit && tsc -p www/tsconfig.json --noEmit && tsc -p studio/tsconfig.json --noEmit",
    "clean": "del-cli docs/.next www/.next studio/.next docs/.source",
    "postinstall": "cd docs && fumadocs-mdx",
    "translate": "cd docs && ai-docs translate",
  },
  "dependencies": {
    /* union of all three manifests, unified versions (below) */
  },
  "devDependencies": {
    /* union, unified */
  },
}
```

**Dependency union (unified versions):**

- From docs: `@ai-toolkit/ai-docs` (workspace:_), `@ai-sdk/react`, `ai`,
  `fumadocs-core/mdx/ui`, `@icons-pack/react-simple-icons`, `@orama/tokenizers`,
  `@streamdown/_`, `@vercel/agent-readability/analytics/speed-insights`, `cmdk`,
`dexie`, `dexie-react-hooks`, `feed`, `geist`, `jotai`, `lucide-react`,
`mermaid`, `motion`, `nanoid`, `next`**16**,`next-themes`, `radix-ui`,
`react`**19**,`react-dom`**19**,`react-player`, `shiki`**3.19.0**,`sonner`, `streamdown`, `tailwind-merge`, `use-stick-to-bottom`, `vaul`, `zod`.
- From www/studio: `ai-toolkit` (workspace:_), `@ai-toolkit/react`
  (workspace:_), `@ai-toolkit/design` (workspace:\*), `lucide-react`.
- Dev: `@shikijs/transformers`, `@tailwindcss/postcss`, `@types/mdx/node/react/**
react-dom` (unified to 19), `postcss`, `tailwindcss` **^4**, `tw-animate-css`,
  `typescript`.

Keep the union's scripts identical in name to today's per-app scripts where
possible (`build`, `dev`, `start`, `lint`, `type-check`, `translate`) so
`tools/scripts/validate-structure.mjs` and muscle memory don't break.

`next dev docs` / `next start docs` — Next accepts a directory argument; the
scripts keep `process.cwd()` inside each site so `.next/` lands in
`apps/<site>/.next` exactly as today (Vercel output detection preserved).

### Phase 1 — Workspace rewiring

1. `pnpm-workspace.yaml`: `- 'apps/*'` → `- 'apps'`.
2. root `tsconfig.json`: remove the `apps/docs`, `apps/studio`, `apps/www`
   references (lines 193-200). App typing continues through
   `apps` `type-check` under turbo; the app tsconfigs are not composite and
   were never real project-ref members. (If root `tsc --build` is desired,
   add an `apps/tsconfig.json` solution that references the three dirs and set
   `"composite": true` in each — not recommended for Next apps.)
3. `pnpm install` → regenerate `pnpm-lock.yaml`; confirm `apps` is the only
   member under `apps**` (`pnpm ls -r --depth -1`).
4. Verify `pnpm prettier-fix`, `turbo install`-generated artifacts
   (`build/`, `build/inventory.json`) — these are outputs of
   `tools/scripts/inventory.mjs` and refresh automatically; regenerate with
   root `pnpm inventory`.

### Phase 2 — Build orchestration (`apps/scripts/`)

`build-one.mjs` (sketch):

```js
const site = process.argv[2]; // 'docs' | 'www' | 'studio' | 'all'
for (const dir of sites(site)) {
  fs.rmSync(join(apps, dir, '.next'), { recursive: true, force: true });
  spawnSync('pnpm', ['exec', 'next', 'build'], {
    cwd: join(apps, dir),
    stdio: 'inherit',
    env: process.env,
  });
}
```

Notes:

- Because the package is spawned directly, dependency packages
  (`@ai-toolkit/ai-docs`, `design`, `react`, `core`, …) **must be built
  first**. Root `turbo build` handles that via `dependsOn: ["^build"]`.
  For single-site builds the deploy command below builds deps separately.
- `turbo.json` `build.outputs` still matches (`apps/.next/**` relative to the
  `apps` package root), so turbo caching keeps working for `pnpm build`.
- `dev` task in `turbo.json` is `persistent: true`; the apps `dev`
  script (`dev-all.mjs`) spawns three `next dev` on distinct ports, e.g.
  **docs:3000, www:3001, studio:3002** (override via `PORT`/env; keep
  `dev:docs|www|studio` on 3000 for the common single-site workflow in CI-free
  local dev where only one studio/www dev runs).

### Phase 3 — Vercel deployments (per project stays separate)

Each site remains its **own Vercel project** with root directory `apps/<site>`
(the project configs are server-side; vercel.json files here define the build):

```jsonc
// apps/docs/vercel.json  (likewise www, studio)
{
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@ai-toolkit/apps^... && pnpm --filter @ai-toolkit/apps run build:docs",
  "devCommand": "next dev",
  "ignoreCommand": "node ../../apps/scripts/vercel-ignore.mjs docs",
}
```

- `--filter=@ai-toolkit/apps^...` builds **only the dependency graph** of the
  apps package (all the `packages/**` outputs), then the site-specific build
  runs. Deps are turbo-cached, so repeated site deploys are cheap; only the
  selected site's `.next` is rebuilt, avoiding bake-off of the other two.
- `vercel-ignore.mjs <site>` mirrors the old `turbo-ignore` intent at
  per-site granularity: `git diff --name-only HEAD~1` and skip the deploy if
  no file under `apps/<site>/`, `apps/package.json`, `apps/scripts/`,
  `pnpm-workspace.yaml`, `pnpm-lock.yaml`, or the site's dep packages changed.
  (`turbo-ignore @ai-toolkit/apps` would cancel deploys for _all_ sites on any
  docs-only change, so the custom script is required.)
- Root `vercel.json` (`pnpm build`) unchanged — it deploys the umbrella site
  and now builds all three under the single package.

### Phase 4 — Stack unification: www + studio → Next 16 / React 19 / Tailwind v4

The forced migration. Scope is small (54 + 38 files, 13 static pages).

1. **deps**: drop `tailwindcss@^3`, `autoprefixer`; add `@tailwindcss/postcss`;
   unified `next@16`, `react@19`, `@types/*@19`.
2. **Tailwind v4**:
   - Replace `tailwind.config.js` + `postcss.config.js` with
     `postcss.config.mjs` (`@tailwindcss/postcss`) and CSS-first setup —
     `app/globals.css` gets `@import "tailwindcss";` + `@theme` token layer.
   - `@ai-toolkit/design` (packages/ui/design): add a Tailwind **v4** preset —
     a `design.css` built on `@theme inline` exporting the same tokens the v3
     preset had (`surface-100/200/300`, `alpha-border`/`strong`, teal accent,
     radii, fonts). Keep the existing v3 `tailwind-preset.cjs` for the
     transition window; www/studio import the CSS preset, then the v3 preset
     can be deleted once nothing consumes it.
   - Replace tailwind `content` globs with `@source` directives
     (`@source "./app/**/*.{ts,tsx}";` etc.). The design package's tokens are
     `@source`-ed like docs' `@vercel/geistdocs` pattern.
3. **React 18 → 19**: fallout audit — audit components for `defaultProps`,
   `forwardRef`-only usage, and `react-dom` APIs. The page sets use plain RSC +
   a few `'use client'` islands; expected to be mechanical.
4. **Next 15 → 16**: static pages; check the `redirects()` callback shape in
   `www/next.config.js` (unchanged API) and remove `next lint` if referenced.
   Docs already proves the stack on this repo.
5. Re-verify `@ai-toolkit/react` adapter + `ai-toolkit` core on React 19 for
   www's `/playground` usage.

If Phase 4 blows up the schedule, the interim escape hatch is **Phase 4b
(hybrid, not "one package")**: keep `docs|www|studio/package.json` as
dependency-only manifests and add all four dirs to `pnpm-workspace.yaml` so
both Next majors install — revisit unification later. Plan A is the committed
target; 4b is only a revert buffer.

### Phase 5 — Cleanup & validation

1. Delete `apps/{docs,www,studio}/package.json` (contents merged in Phase 0).
2. Delete stale `apps/www/REFACTORING-PLAN.md`/`apps/studio/PLAN.md`? — no:
   keep as historical docs, they document intent. Add a short
   `apps/README.md` run book (`pnpm --filter @ai-toolkit/apps dev`, `build:*`,
   deploy table).
3. Update references to the old names anywhere else:
   `grep -rn "@ai-toolkit/docs|@ai-toolkit/www|@ai-toolkit/studio" --include=*.json --include=*.yml --include=*.mjs` →
   only the three vercel.json files (Phase 3) and generated
   `build/inventory.json` (regenerated).
4. Confirm `turbo build` from root still produces all three sites and the
   root `pnpm build` (`--concurrency 1`) passes.

### Phase 6 — (optional) De-duplicate content

Two parallel content trees exist today: root `content/**` (www/studio numeric
prefixes) and `apps/docs/content/**` (Geistdocs tree + `meta.json`).
`validate-structure.mjs` already enforces coverage both ways
(lines 314-448). Once merge lands, consider making `apps/content/**` the
canonical tree and repointing www/studio reads, or keep as-is. **Out of scope
for the merge**; do not co-mingle source-of-truth during the move.

---

## 4. File-by-file change table

| File                                                                                               | Action                                                                      |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ | --------------- |
| `apps/package.json`                                                                                | **add** — `@ai-toolkit/apps`, union deps, aggregated scripts                |
| `apps/scripts/build-one.mjs`, `build-all.mjs`, `dev-all.mjs`, `start-one.mjs`, `vercel-ignore.mjs` | **add**                                                                     |
| `apps/README.md`                                                                                   | **add**                                                                     |
| `pnpm-workspace.yaml`                                                                              | edit `'apps/*'` → `'apps'`                                                  |
| `tsconfig.json` (root)                                                                             | remove `apps/docs                                                           | studio | www` references |
| `apps/docs/vercel.json`, `apps/www/vercel.json`, `apps/studio/vercel.json`                         | edit `buildCommand`, `ignoreCommand`                                        |
| `apps/docs/package.json`                                                                           | **delete**                                                                  |
| `apps/www/package.json`                                                                            | **delete**                                                                  |
| `apps/studio/package.json`                                                                         | **delete**                                                                  |
| `apps/www/{app,components,lib}`, `apps/studio/{app,components,lib}`                                | Phase 4 Tailwind v4 / React 19 migration edits                              |
| `packages/ui/design`                                                                               | add Tailwind v4 `design.css` preset (`@theme`); keep v3 preset until unused |
| `pnpm-lock.yaml`, `build/inventory.json`                                                           | regenerated                                                                 |

---

## 5. Risks & mitigations

| Risk                                                       | Impact                                          | Mitigation                                                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| www/studio break on Next 16/React 19/TW4                   | high if static pages use deprecated APIs        | small surface (13 pages); docs already proves stack; Phase 4 staged behind dep merge so `install` stays green |
| `@ai-toolkit/design` TW3→TW4 preset drift                  | visual regression                               | preserve exact token values in `@theme`; visual diff / screenshot smoke before flipping                       |
| `fumadocs-mdx` postinstall now runs from `apps/`           | `.source/` regeneration breaks                  | keep `postinstall: cd docs && fumadocs-mdx`, pin binary via `pnpm exec` if path resolution is flaky           |
| Vercel `vercel-ignore.mjs` heuristic                       | wrong skip = stale deploy / unnecessary deploy  | default to deploy on any doubt (`exit 0` = skip only when provably unrelated)                                 |
| turbo cache keyed on `apps` package lumps all sites        | docs-only change rebuilds all in umbrella build | per-site `--filter=...apps^...` + `build:<site>` for Vercel projects; umbrella `pnpm build` only in root/CI   |
| `next`/`react` single-version drift hits pinned docs stack | docs regress                                    | docs pins already match the union (`next 16.3.3`, react ^19.2.3); union uses those as source of truth         |

---

## 6. Verification checklist

From repo root after the merge:

1. `pnpm install` — lockfile rewrites; `apps` shows as the only `apps**` member.
2. `pnpm --filter @ai-toolkit/apps run type-check` — docs/www/studio all type-check.
3. `pnpm --filter @ai-toolkit/apps run lint`.
4. `pnpm turbo build --filter=@ai-toolkit/apps^... && pnpm --filter @ai-toolkit/apps run build:docs` — simulates the Vercel docs deploy; `.next` lands in `apps/docs/.next`.
5. `pnpm build` (root) — all three sites build; turbo outputs cached.
6. `node apps/scripts/vercel-ignore.mjs docs` — asserts skip vs deploy behavior.
7. Smoke: `docs` search + `/docs/...mdx` negotiation, `www` `/playground` toggle, `studio` tables/drawers — via `pnpm --filter @ai-toolkit/apps dev` (ports 3000/3001/3002).

## 7. Rollback

Because nothing but manifests/tooling moves, rollback = `git revert` of the
merge commit(s) plus restoring the three `apps/*/package.json` files; the
source trees never relocate. No new publishable artifacts are created, so no
changeset is required (all apps remain `private`).
