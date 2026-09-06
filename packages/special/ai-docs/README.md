# @ai-toolkit/ai-docs

Vendored fork of `@vercel/geistdocs@1.26.1` (Apache-2.0, © Vercel), renamed to
ai-docs. The runtime is byte-identical to upstream 1.26.1 except for the
rebrand (`@vercel/geistdocs` → `@ai-toolkit/ai-docs`, `Geistdocs*` symbols →
`AiDocs*`, CLI `geistdocs` → `ai-docs`, including the self-references inside
`dist/`).

**Owner**: `@khulnasoft/ai-toolkit-core`

## Why a fork

`apps/docs` consumes the package-backed AiDocs architecture (thin local
adapters over package-owned runtime), but the project does not use the
`@vercel/*` package scope. A re-export wrapper would still download the
upstream tarball, so the package is vendored here instead.

## Sync policy (upstream updates)

Do **not** run `ai-docs update` — it queries the npm registry for this
package name, which is private and unpublished, and will fail. To take a new
upstream version:

1. `pnpm add -D <tmp>` is not needed; instead copy the new published package
   over this directory (excluding its `node_modules`), preserving this
   `README.md` and the `name`/`private`/`stability`/`owners` fields in
   `package.json`.
2. Re-apply the rebrand: replace every `@vercel/geistdocs` scope with
   `@ai-toolkit/ai-docs`, every `Geistdocs` symbol prefix with `AiDocs`, and
   the `geistdocs` CLI name with `ai-docs` (runtime self-imports live in
   `dist/internal/ui/navigation-menu.js`, `dist/components/code-block.js`,
   `dist/components/command-prompt.js`, plus message strings in
   `dist/cli/index.js`, `dist/next.js`, `dist/internal/not-implemented.js`,
   `dist/versions.d.ts`).
3. Update `version` in `package.json` to the upstream version.
4. Run `pnpm install`, then verify with
   `pnpm --filter @ai-toolkit/docs type-check` and
   `pnpm --filter @ai-toolkit/docs build`.

## Layout

- `dist/` — prebuilt runtime (do not hand-edit except for the rebrand
  described above).
- `source-config.js` — Fumadocs collection helpers (`source.config.ts` entry).
- `template/` — reference scaffold the app adapters were copied from.
- `docs/` — package docs for agents (read-only reference).
- `cli.js` (`ai-docs` bin) — `search sync` / `translate` commands.
  `update` is intentionally unsupported (see sync policy).
- `theme.css` / `styles.css` — Geist design layer imported by the app.
