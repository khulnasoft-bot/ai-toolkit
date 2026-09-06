# AiDocs Package Docs

These docs are bundled with `@ai-toolkit/ai-docs` 1.26.1 so agents can understand the installed package without web access.
They are generated from `apps/template/content/docs` during the package build.

## How to use these files

- Read `docs/sitemap.md` first to identify focused pages.
- Read `docs/pages/*.md` for task-specific guidance.
- Read `docs/llms.txt` when you need the complete AiDocs documentation context.
- Use `docs/manifest.json` when you need structured metadata for every bundled page.
- Do not edit package internals in `node_modules/@ai-toolkit/ai-docs`; configure local adapters in the generated app instead.

## Important package surfaces

- `@ai-toolkit/ai-docs/config` for `defineConfig` and config types.
- `@ai-toolkit/ai-docs/source` for Fumadocs source adapters.
- `@ai-toolkit/ai-docs/pages/docs` for docs page rendering.
- `@ai-toolkit/ai-docs/routes/*` for search, chat, Markdown, sitemap, and agent-readiness routes.
- `@ai-toolkit/ai-docs/proxy` for markdown negotiation, AI-agent rewrites, and i18n fallback.
- `@ai-toolkit/ai-docs/source-config` for source-config-safe Fumadocs schemas and plugins.

## Bundled pages

- [Overview](pages/index.md): AiDocs is a packaged documentation system for creating Next.js and Fumadocs sites with shared runtime features.
- [Getting Started](pages/getting-started.md): Create a AiDocs project, run it locally, and edit your first documentation page.
- [Environment Variables](pages/env.md): Environment variables required by AiDocs for AI chat, Mixedbread retrieval, proxy mode, and production URL configuration.
- [Deploy to Vercel](pages/deployment.md): Deploy a AiDocs site to Vercel with the required project settings, environment variables, and private-package access.
- [Migration guide](pages/migration.md): Move an existing documentation site to @ai-toolkit/ai-docs while keeping local content, routing, middleware behavior, and AI-readable surfaces intact.
- [Configuration](pages/configuration.md): Configure site metadata, navigation, AI features, page actions, translations, and local adapters.
- [Syntax](pages/syntax.md): Supported MDX syntax including text formatting, code blocks, line highlighting, and Mermaid diagrams.
- [AiDocs Provider](pages/provider.md): The root provider component that wraps your application to handle toast notifications, search, and analytics.
- [Versioned docs](pages/versioned-docs.md): Use createVersionedSources to configure stable, pre-release, or host-based documentation versions.
- [Proxy and markdown routes](pages/proxy.md): Configure createProxy with generated route discovery, request hooks, markdown mappings, and a static Next.js matcher.
- [.md Extension](pages/md.md): Access any documentation page as raw Markdown by appending .md or .mdx to the URL for AI tool consumption.
- [Agent readiness](pages/agent-readiness.md): Generate /agents.md and /.well-known/mcp.json from AiDocs config so agents can find docs, Markdown surfaces, API specs, and MCP endpoints.
- [Ask AI](pages/ask-ai.md): An AI-powered chat assistant with context-aware search, persistent history, and suggested prompts for your documentation.
- [Configure sidebar navigation](pages/guides/nested-navigation.md): Configure sidebar order, section labels, folder landing pages, and deeply nested page trees with meta.json files.
- [Edit on GitHub](pages/edit-on-github.md): A direct link on every documentation page that lets readers propose changes through GitHub pull requests.
- [Feedback](pages/feedback.md): An interactive feedback widget that collects user sentiment and creates structured GitHub Issues automatically.
- [Improve Ask AI answers with Mixedbread](pages/mixedbread-retrieval.md): Provision a Mixedbread Store for one AiDocs consumer site, enable semantic retrieval, and sync documentation during production builds.
- [Internationalization](pages/internationalization.md): Serve documentation in multiple languages with automatic translation via the AiDocs CLI and Fumadocs routing.
- [llms.txt](pages/llms-txt.md): A single endpoint that returns all documentation as plain Markdown text following the llms.txt standard.
- [Open in Chat](pages/open-in-chat.md): Transfer documentation context to AI chat platforms like ChatGPT, Claude, Cursor, and v0 with a single click.
- [RSS](pages/rss.md): An automatically generated RSS 2.0 feed that keeps users informed when documentation is published or updated.
- [Table of contents](pages/table-of-contents.md): AiDocs builds the "On this page" outline from your headings, indents sub-headings under their parent, and tracks the active section along a straight vertical guide rail.
- [Theme-Aware Image](pages/theme-aware-image.md): A component that swaps images based on the active theme, built on top of Next.js Image.
