---
title: Migration guide
description: Migrate a Fumadocs or custom Geist docs site to package-backed AiDocs
type: guide
summary: Move an existing documentation site to @ai-toolkit/ai-docs while keeping local content, routing, middleware behavior, and AI-readable surfaces intact.
url: /docs/migration
source: apps/template/content/docs/migration.mdx
prerequisites:
  - /docs/configuration
  - /docs/proxy
related:
  - /docs/versioned-docs
  - /docs/llms-txt
  - /docs/agent-readiness
---

# Migration guide

Migrate an existing Fumadocs or custom Geist documentation site to `@ai-toolkit/ai-docs` by moving shared behavior into package APIs and keeping site-specific adapters local. The safest migration keeps content, routing decisions, and product-specific UI in your app while replacing copied runtime code with thin package-backed adapters.

> Note:
  The current Geistcn migration is available from the `canary` dist-tag, not `latest`. The canary depends on restricted `@vercel/geistcn` packages and is intended for Vercel-internal projects while the migration is evaluated.

  Help me migrate this existing docs site to package-backed AiDocs. First determine whether I should use the stable release or the Geistcn canary. Inspect `source.config.ts`, `lib/ai-docs/source.ts`, app route files, `proxy.ts` or `middleware.ts`, `public/llms.txt`, Open Graph routes, Tailwind CSS setup, `package.json` AI SDK dependencies, and environment variables. For the Geistcn canary, also inspect package authentication, `@ai-toolkit/ai-docs` component and asset imports, root HTML classes, and Next.js configuration. Pin the selected version and use package APIs without copying package internals.

## Before you migrate

Create a working branch and inventory the current site before replacing code:

- Existing Fumadocs collections in `source.config.ts`.
- Public route families, such as `/docs`, `/api-reference`, `/guides`, or `/`.
- Existing `middleware.ts` or `proxy.ts` behavior.
- Static files that overlap package routes, such as `public/llms.txt`.
- Search, chat, `llms.txt`, page-level Markdown, `sitemap.md`, `agents.md`, `/.well-known/mcp.json`, RSS, and Open Graph routes.
- Tailwind CSS version and custom plugins.
- Imports from `@ai-toolkit/ai-docs/components/*` or `@ai-toolkit/ai-docs/assets/*` that the Geistcn canary removes.
- Direct app usage of `ai` or `@ai-sdk/react` outside AiDocs.
- Environment variables required by the homepage, docs routes, or API routes.

Run the current project before changing it:

```bash title="Terminal"
pnpm install
pnpm build
```

Fix unrelated build failures first. A migration is safer when the starting point is reproducible.

## Install AiDocs

For the current stable package-backed release, install `latest` and record the exact resolved version:

```bash title="Terminal"
pnpm add --save-exact @ai-toolkit/ai-docs@latest
```

AiDocs requires Node.js 20.9 or later and Next.js 16.3.3 or later within 16.x. Earlier 16.3 releases can retain an optional catch-all route's index content after a client navigation to a child page when Cache Components and Partial Prefetching are enabled.

If you are starting from a generated stable AiDocs project and moving content into it, run the CLI from an empty parent folder:

```bash title="Terminal"
pnpm dlx @ai-toolkit/ai-docs@latest init --name my-docs
```

### Install the Geistcn canary

The Geistcn canary requires npm access to restricted `@vercel` packages. Configure your user-level npm authentication before installation:

```ini title="~/.npmrc"
@vercel:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
always-auth=true
```

Set `NPM_TOKEN` from an approved internal source and keep its value out of files and Git. Read [Deploy to Vercel](/docs/deployment#configure-private-package-access) for Vercel and GitHub Actions access.

For an existing standalone project, install the canary and the direct Geistcn dependencies used by application files. The current canary template uses `@vercel/geistcn` 1.0.3 and `@vercel/geistcn-assets` 2.0.1:

```bash title="Terminal"
pnpm add --save-exact \
  @ai-toolkit/ai-docs@canary \
  @vercel/geistcn@1.0.3 \
  @vercel/geistcn-assets@2.0.1
```

`--save-exact` records the canary resolved at install time instead of a range. Before upgrading later, check the next canary and test that exact version:

```bash title="Terminal"
npm view @ai-toolkit/ai-docs dist-tags.canary
```

In a monorepo that owns the Geistcn packages, such as `vercel/front`, keep their existing `workspace:*` dependency specifications and pin only `@ai-toolkit/ai-docs` to the tested canary.

If you are starting from a generated AiDocs project and moving content into it, run the canary CLI from an empty parent folder:

```bash title="Terminal"
pnpm dlx @ai-toolkit/ai-docs@canary init --name my-docs
```

## Replace imports for the Geistcn canary

The Geistcn canary removes generic design-system components and assets from the AiDocs public API. Search for affected imports before upgrading:

```bash title="Terminal"
rg '@ai-toolkit/ai-docs/(components|assets)' .
```

Replace imports according to this table:

| Previous AiDocs import | Replacement |
| --- | --- |
| `components/badge`, `components/button`, `components/dialog`, `components/drawer`, `components/input`, `components/kbd`, `components/separator`, `components/sheet`, `components/spinner`, `components/textarea`, `components/theme-switcher`, or `components/tooltip` | Import the matching component directly from `@vercel/geistcn/components/<name>`. |
| `components/switch` | Import toggle controls from `@vercel/geistcn/components/toggle`. |
| `components/sonner` | Use `Toasts` and `useToasts` from `@vercel/geistcn/components/toasts`. |
| `components/theme-aware-image` | Use `Image` from `@vercel/geistcn/components/image` with `srcLight` and `srcDark`. |
| `assets/icons`, `assets/icons/*`, `assets/logos`, or `assets/logos/*` | Import from `@vercel/geistcn-assets/icons`, `@vercel/geistcn-assets/icons/*`, `@vercel/geistcn-assets/logos`, or `@vercel/geistcn-assets/logos/*`. |
| `components/button-group`, `components/card`, or `components/input-group` | Use an appropriate Geistcn component or keep an application-owned composition. There is no direct Geistcn replacement with the same API. |

Keep documentation-specific composites such as `Callout`, `CodeBlock`, `CodeBlockTabs`, `CommandPrompt`, `CopyPrompt`, and `Mermaid` imported from `@ai-toolkit/ai-docs/components/*`.

## Configure Next.js

The AiDocs Next.js integration composes Fumadocs MDX, enables automatic app-route discovery for agent-readable 404s, and preserves your Next.js configuration. Enable Cache Components in the same file:

```ts title="next.config.ts"
import { createAiDocs } from "@ai-toolkit/ai-docs/next";
import type { NextConfig } from "next";

const withAiDocs = createAiDocs();

const config: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default withAiDocs(config);
```

### Configure Next.js for the Geistcn canary

Geistcn publishes TypeScript source from supporting packages. A project using the Geistcn canary also needs the matching transpilation and modular import settings:

```ts title="next.config.ts"
import { createAiDocs } from "@ai-toolkit/ai-docs/next";
import type { NextConfig } from "next";

const withAiDocs = createAiDocs();

const config: NextConfig = {
  modularizeImports: {
    "@vercel/geistcn/components": {
      skipDefaultConversion: true,
      transform: "@vercel/geistcn/components/{{ kebabCase member }}",
    },
    "@vercel/geistcn/core": {
      skipDefaultConversion: true,
      transform: "@vercel/geistcn/core",
    },
  },
  transpilePackages: [
    "@vercel/geistcn",
    "@vercel/geist-test-utils",
    "@vercel/next-themes",
  ],
  cacheComponents: true,
  partialPrefetching: true,
};

export default withAiDocs(config);
```

Restart `next dev` after adding, deleting, or renaming an App Router page or route. Production builds always regenerate the route manifest.

Every root dynamic parameter needs at least one value from `generateStaticParams`. For a site with a `[lang]` root segment, return every configured language from the root layout:

```tsx title="app/[lang]/layout.tsx"
export const generateStaticParams = () => [{ lang: "en" }];
```

Server Components can read the active language without passing `params` through each layout:

```tsx title="app/[lang]/docs/layout.tsx"
import * as root from "next/root-params";

export default async function DocsLayout({ children }) {
  const language = await root.lang();
  // Use language to select the page tree.
  return children;
}
```

Keep using route context `params` in Route Handlers and Server Actions. Next.js does not support `next/root-params` in those contexts.

Remove `dynamic`, `revalidate`, and `fetchCache` exports from App Router pages and route handlers. Cache Components replaces those route segment options with `use cache` and `cacheLife`.

Keep `partialPrefetching` enabled so links reuse each route's static and cached content instead of prefetching every destination page separately.

For unknown HTML pages, browsers can receive the docs loading shell with a `200` response before the page resolves to the not-found UI. Crawlers wait for the complete response and receive `404`. Machine-readable Markdown routes keep their configured status behavior.

## Configure the root layout for the Geistcn canary

Geistcn provides the fonts, theme classes, and Tailwind preflight used by the package UI. Apply them to the root `<html>` element:

```tsx title="app/[lang]/layout.tsx"
import { geistFontClasses } from "@vercel/geistcn/core";
import { cn } from "@vercel/geistcn/utils";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={cn(
        geistFontClasses,
        "tailwind tailwind-preflight antialiased"
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
```

Keep the site's existing providers and metadata inside this structure. If the route has a `[lang]` parameter, use the active language instead of the hardcoded `en` value.

## Align Ask AI dependencies

AiDocs Ask AI uses AI SDK v6. Generated projects install `ai` v6 and `@ai-sdk/react` v3 so package-owned chat components and route helpers use the supported AI SDK APIs.

If the existing app imports `ai` or `@ai-sdk/react` for product-specific features, migrate that code separately. Keep AiDocs route adapters package-backed, and do not copy package chat internals into the app to preserve older AI SDK behavior.

## Update source config

Use the source-config-safe export from `@ai-toolkit/ai-docs/source-config` in `source.config.ts`. This file is evaluated by `fumadocs-mdx` during dependency installation and builds, so avoid importing runtime component entry points from it.

```ts title="source.config.ts"
import {
  defineAiDocsSourceConfig,
  aiDocsFrontmatterSchema,
  aiDocsMetaSchema,
} from "@ai-toolkit/ai-docs/source-config";
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: aiDocsFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: aiDocsMetaSchema,
  },
});

export default defineAiDocsSourceConfig();
```

For multiple docs families, create one collection per directory and reuse `aiDocsFrontmatterSchema`.

## Create the package config

Use `@ai-toolkit/ai-docs/config` to centralize site metadata and route families in `lib/ai-docs/config.tsx`.

```tsx title="lib/ai-docs/config.tsx"
import { defineConfig } from "@ai-toolkit/ai-docs/config";
import { Logo, github, nav, prompt, suggestions, title } from "@/ai-docs";

export const config = defineConfig({
  title,
  defaultLanguage: "en",
  logo: <Logo />,
  github,
  nav,
  content: [{ id: "docs", label: "Docs", dir: "content/docs", route: "/docs" }],
  ai: {
    prompt,
    suggestions,
  },
});
```

Set `content` to every public documentation route family. `createProxy` uses this metadata to infer standard Markdown mappings for non-root sections.

## Connect Fumadocs sources

Wrap each Fumadocs collection with `createSource` in `lib/ai-docs/source.ts`.

```ts title="lib/ai-docs/source.ts"
import { createSource } from "@ai-toolkit/ai-docs/source";
import { docs } from "@/.source/server";
import { config } from "./config";

export const aiDocsSource = createSource({
  docs,
  config,
  id: "docs",
  label: "Docs",
});

export const source = aiDocsSource.source;
```

For root-mounted docs, set `baseUrl: "/"` and use explicit `markdownRoutes` in `proxy.ts`:

```ts title="lib/ai-docs/source.ts"
export const aiDocsSource = createSource({
  docs,
  config,
  baseUrl: "/",
});
```

If the Next.js application also uses `basePath`, pass the same value through `defineConfig` but do not add it to `baseUrl`, `content.route`, `getPageUrl`, or `markdownRoutes`. Those values remain app-local. AiDocs adds the public prefix to page actions, metadata, generated Markdown, discovery links, chat citations, and proxy destinations.

## Add route adapters

Keep App Router files thin. Route files should call package helpers instead of copying package internals.

```tsx title="app/[lang]/docs/[[...slug]]/page.tsx"
import { createDocsPage } from "@ai-toolkit/ai-docs/pages/docs";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

const docsPage = createDocsPage({
  config,
  source: aiDocsSource,
  openGraph: {
    images: true,
  },
});

export default docsPage.Page;
export const generateStaticParams = docsPage.generateStaticParams;
export const generateMetadata = docsPage.generateMetadata;
```

Set `openGraph.images` to `true` only when your app includes the AiDocs OG route. If you do not add the OG route, omit `openGraph` or override metadata to avoid broken `/og/...` references.

## Add AI-readable routes

Add the package route helpers for machine-readable docs surfaces.

```ts title="app/[lang]/llms.txt/route.ts"
import { createLlmsRoute } from "@ai-toolkit/ai-docs/routes/llms";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET } = createLlmsRoute({
  sources: [aiDocsSource],
});
```

```ts title="app/[lang]/llms.mdx/[[...slug]]/route.ts"
import { createDocsMarkdownRoute } from "@ai-toolkit/ai-docs/routes/llms";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET, generateStaticParams } =
  createDocsMarkdownRoute({
    notFound: {},
    source: aiDocsSource,
  });
```

```ts title="app/[lang]/sitemap.md/route.ts"
import { createSitemapMarkdownRoute } from "@ai-toolkit/ai-docs/routes/sitemap";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET, generateStaticParams } =
  createSitemapMarkdownRoute({
    config,
    sources: [{ source: aiDocsSource.source }],
  });
```

```ts title="app/[lang]/agents.md/route.ts"
import { createAgentsRoute } from "@ai-toolkit/ai-docs/routes/agents";
import { config } from "@/lib/ai-docs/config";

export const { GET, generateStaticParams } = createAgentsRoute({
  config,
});
```

```ts title="app/[lang]/.well-known/mcp.json/route.ts"
import { createMcpManifestRoute } from "@ai-toolkit/ai-docs/routes/mcp";
import { config } from "@/lib/ai-docs/config";

export const { GET, generateStaticParams } = createMcpManifestRoute({
  config,
});
```

Delete `public/llms.txt` after adding `createLlmsRoute`. Static files in `public` can mask App Router route behavior.

## Add search and Ask AI routes

Use package route helpers for search and chat. Keep these files as adapters so `@ai-toolkit/ai-docs` can ship AI SDK compatibility fixes.

```ts title="app/api/search/route.ts"
import { createSearchRoute } from "@ai-toolkit/ai-docs/routes/search";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const GET = createSearchRoute({ config, sources: [aiDocsSource] });
```

```ts title="app/api/chat/route.ts"
import { createChatRoute } from "@ai-toolkit/ai-docs/routes/chat";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

const chatProxyUrl = process.env.GEISTDOCS_CHAT_PROXY_URL;
const chatProxyToken = process.env.GEISTDOCS_CHAT_PROXY_TOKEN;

export const { POST, maxDuration } = createChatRoute({
  config,
  proxy: chatProxyUrl
    ? {
        url: chatProxyUrl,
        headers: chatProxyToken
          ? { Authorization: `Bearer ${chatProxyToken}` }
          : undefined,
      }
    : undefined,
  sources: [aiDocsSource],
});
```

Leave `GEISTDOCS_CHAT_PROXY_URL` unset for default AI Gateway mode. Set it to a `/vertex` proxy URL only when Ask AI should route model requests through the central Vertex-backed service.

## Migrate middleware behavior

Use `createProxy` in `proxy.ts`. Put existing `middleware.ts` behavior in `before` or `after` hooks instead of replacing AiDocs markdown negotiation.

```ts title="proxy.ts"
import { createProxy } from "@ai-toolkit/ai-docs/proxy";
import { NextResponse } from "next/server";
import { config as aiDocsConfig } from "@/lib/ai-docs/config";

const proxy = createProxy({
  config: aiDocsConfig,
  before: async ({ request }) => {
    if (request.nextUrl.pathname === "/legacy-docs") {
      return NextResponse.redirect(new URL("/docs", request.url));
    }

    return null;
  },
});

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default proxy;
```

Use `api(?:/|$)` in the matcher. A broad `api` exclusion also excludes routes such as `/api-reference`.

## Configure Markdown route mappings

For standard non-root sections, `createProxy` can infer Markdown routes from `config.content`.

Use explicit `markdownRoutes` when the public docs URL does not map directly to the Markdown route handler:

```ts title="proxy.ts"
const proxy = createProxy({
  config: aiDocsConfig,
  markdownRoutes: [
    { from: "/docs/*path", to: "/[lang]/llms.mdx/*path" },
    { from: "/api-reference/*path", to: "/[lang]/llms.mdx/api-reference/*path" },
  ],
});
```

Root-mounted docs need explicit mappings. If a homepage or app routes also live at `/`, do not use a broad `/*path` mapping. Map each docs family separately:

```ts title="proxy.ts"
const proxy = createProxy({
  config: aiDocsConfig,
  markdownRoutes: [
    { from: "/guides/*path", to: "/[lang]/llms.mdx/guides/*path" },
    { from: "/api-reference/*path", to: "/[lang]/llms.mdx/api-reference/*path" },
  ],
});
```

For a base-path application whose root page is documentation, add `"/"` to the static proxy matcher and verify `<basePath>/index.md`. Keep normal application and API paths out of a broad root Markdown mapping with matcher exclusions or a `before` hook.

## Configure Tailwind CSS

Stable AiDocs uses Tailwind CSS v4 with source entries for package components and related dependencies:

```css title="app/styles/ai-docs.css"
@import "tailwindcss";
@import "fumadocs-ui/css/shadcn.css";
@import "fumadocs-ui/css/preset.css";
@import "tw-animate-css";

@source "../../node_modules/@ai-toolkit/ai-docs/dist/**/*.js";
@source "../../node_modules/streamdown/dist/*.js";
```

Move Tailwind CSS v3 plugin utilities into CSS-first v4 utilities or theme variables. Keep custom token names stable while you migrate components.

### Configure Tailwind CSS for the Geistcn canary

For the Geistcn canary, use the import order and narrow Geistcn source scan from the canary template:

```css title="app/styles/ai-docs.css"
@import "@vercel/geistcn/tailwind.css";
@import "fumadocs-ui/css/shadcn.css";
@import "fumadocs-ui/css/preset.css";
@import "@ai-toolkit/ai-docs/theme.css";
@import "@vercel/geistcn/styles.css";
@import "@vercel/geistcn/marketing-typography.css";

@source "../../node_modules/@vercel/geistcn/src/components/**/*.{ts,tsx}";
```

Geistcn owns the Geist tokens, theme, typography, preflight, and animation utilities. The AiDocs theme entry point contains documentation and Fumadocs integration rules and sources the compiled AiDocs runtime. Do not scan all of `@vercel/geistcn/src`; font internals in the published package can reference paths outside the application root and cause Turbopack to fail.

## Handle environment variables

Do not require production secrets for local migration builds. If a homepage or API route depends on a production-only secret, add a local fallback or disable that integration in development.

```ts title="lib/example-secret.ts"
export const flagsSecret =
  process.env.FLAGS_SECRET ??
  (process.env.NODE_ENV === "development" ? "local-development-secret" : undefined);
```

Keep real application secrets in `.env.local` and out of Git. `NPM_TOKEN` is an install-time credential, not an application environment variable. Keep it in your shell, Vercel project settings, or GitHub Actions secrets, and never prefix it with `NEXT_PUBLIC_`.

## Verify the migration

Run the same checks after each routing or source change:

```bash title="Terminal"
pnpm postinstall
pnpm list @ai-toolkit/ai-docs
pnpm build
pnpm dev
```

For the Geistcn canary, also run `pnpm list @vercel/geistcn @vercel/geistcn-assets` and confirm the versions match the selected canary template.

Check these URLs locally:

- `/docs` or the migrated docs root.
- `/llms.txt`.
- `/sitemap.md`.
- `/agents.md`.
- `/.well-known/mcp.json` if `agent.mcp.servers` is configured.
- A page-level Markdown URL such as `/docs/getting-started.mdx`.
- A non-docs route that should not be rewritten as Markdown, such as the homepage.

## Next steps

- Read [Configuration](/docs/configuration) to review package config options.
- Read [Proxy and markdown routes](/docs/proxy) to tune request handling.
- Read [Agent readiness](/docs/agent-readiness) to configure `/agents.md` and `/.well-known/mcp.json` for AI agents.
