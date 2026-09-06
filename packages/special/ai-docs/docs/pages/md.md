---
title: .md Extension
description: Access documentation pages as raw Markdown by appending .md or .mdx to any URL
type: conceptual
summary: Access any documentation page as raw Markdown by appending .md or .mdx to the URL for AI tool consumption.
url: /docs/md
source: apps/template/content/docs/md.mdx
related:
  - /docs/agent-readiness
  - /docs/llms-txt
  - /docs/proxy
---

# .md Extension

AiDocs lets AI tools and language models access documentation pages as plain Markdown. Append `.md` or `.mdx` to a documentation URL to get the processed Markdown content for that page.

  Help me test raw Markdown routes in this AiDocs project. Fetch a docs page with `.mdx` appended, compare it to the rendered page, and explain how AI tools can use it.

## How it works

When you add `.md` or `.mdx` to a documentation URL, AiDocs returns the page content as Markdown instead of rendered HTML. AI tools can use that response as focused context for one page.

### Example

```
# Normal page
https://yourdomain.com/docs/getting-started

# Markdown version
https://yourdomain.com/docs/getting-started.mdx
```

The `.mdx` version returns:

- The page title as an H1 heading
- The full processed Markdown content
- No HTML, styling, or navigation

For a docs section mounted at `/docs`, the section root remains `/docs.md`. For a source mounted at the app root with `baseUrl: "/"`, AiDocs uses `/index.md` for the root page. If Next.js has `basePath: "/docs"`, that public root Markdown URL is `/docs/index.md`.

Copy Page, View as Markdown, and the `text/markdown` metadata alternate all use the same package resolver. View as Markdown opens the resolved `.md` URL in a new tab from a button, which keeps the URL shareable without adding an anchor to the page. Use `createDocsPage({ getMarkdownUrl })` only when the deployment needs a different public contract.

## Use cases

This feature is particularly useful for:

- **AI Chat Tools** - Tools like ChatGPT, Claude, and Cursor can fetch and read your docs
- **LLM Context** - Provides clean text for language model prompts
- **Documentation Analysis** - Extract content for processing or analysis
- **Content Migration** - Export documentation in a clean format

## Implementation

The package proxy routes `.md` and `.mdx` requests to the package-backed markdown route handler:

```ts title="proxy.ts"
const proxy = createProxy({
  config: aiDocsConfig,
  markdownRoutes: [
    { from: "/docs/*path", to: "/[lang]/llms.mdx/*path" },
  ],
});
```

The destination route uses `createDocsMarkdownRoute` to process the page and return Markdown with a `text/markdown` content type:

```ts title="app/[lang]/llms.mdx/[[...slug]]/route.ts"
import { createDocsMarkdownRoute } from "@ai-toolkit/ai-docs/routes/llms";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET, generateStaticParams } =
  createDocsMarkdownRoute({
    sources: [aiDocsSource],
  });
```

Read [Proxy and markdown routes](/docs/proxy) to configure additional route families such as `/cookbook` or `/v5/docs`.

## Response Format

The response includes:

- Content-Type: `text/markdown`
- `Link: <canonical page URL>; rel="canonical"` for resolved pages
- The page title as a level 1 heading
- Processed Markdown content from Fumadocs

All MDX components are processed and converted to plain Markdown equivalents.

## Missing documentation pages

When a Markdown request does not match a page, AiDocs returns an agent-readable `Page Not Found` response. It compares the requested path with visible page paths and titles, then links up to five likely matches with their descriptions. If no match is useful, the response links to `/llms.txt` instead.

For example, a request for `/docs/env-vars` can suggest `/docs/environment-variables.md`. The response uses a short cache lifetime and returns a real `404` status. It also sends `X-Robots-Tag: noindex` and no canonical link because the requested page does not exist. Regular HTML requests keep the app's standard not-found behavior.

The suggestion response is enabled by default. Pass `notFound: { status: 410 }` for permanently removed pages, or `notFound: false` to use the standard Next.js not-found response. Legacy `status: 200` values are treated as `404` so missing pages always return a real error status.

If a custom `markdownRoutes` mapping changes the public path shape, set `notFound.getRequestedPath` to reconstruct the app-local public pathname. This also keeps page lookup and suggestions within the right source when a flattened route serves multiple sources:

```ts
notFound: {
  getRequestedPath: ({ slug }) =>
    slug[0] === "integrations"
      ? `/${slug.join("/")}`
      : ["/docs", ...slug].join("/"),
},
```

Set `notFound.getPageMarkdownUrl` as well when suggested pages use a custom app-local Markdown URL.

### Unmatched application paths

When `agent` is enabled, `createAiDocs` scans App Router pages and route handlers during `next dev` and `next build`. `createProxy` uses that generated manifest to distinguish valid application routes from unknown paths. Valid routes continue to the app's HTML or route-handler response. Unknown Markdown or detected-agent `GET` and `HEAD` requests receive a concise 404 with links to the docs, `sitemap.md`, and `llms.txt`.

Markdown mappings take precedence over generated app routes, so a route that has both HTML and Markdown continues to negotiate Markdown. Dynamic app routes are treated as potentially valid; the app remains responsible for returning its own 404 when a specific slug does not exist.

Pass `markdownNotFound: false` to disable automatic unmatched-path recovery:

```ts title="proxy.ts"
const proxy = createProxy({
  config: aiDocsConfig,
  markdownNotFound: false,
});
```

Sites that do not use `createAiDocs` keep the previous opt-in behavior. Existing boolean and predicate forms remain supported for compatibility.

`createNotFoundRoute` remains available for apps that prefer an explicit catch-all Route Handler with AiDocs' minimal HTML response.
