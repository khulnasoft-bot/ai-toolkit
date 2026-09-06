# AiDocs Documentation Sitemap

This file maps the documentation bundled with `@ai-toolkit/ai-docs`.
Use it to choose focused page files from `docs/pages/` before reading the full `llms.txt` bundle.

- [Overview](pages/index.md) | URL: /docs | Type: overview | Summary: AiDocs is a packaged documentation system for creating Next.js and Fumadocs sites with shared runtime features.
- [Getting Started](pages/getting-started.md) | URL: /docs/getting-started | Type: guide | Summary: Create a AiDocs project, run it locally, and edit your first documentation page.
- [Environment Variables](pages/env.md) | URL: /docs/env | Type: reference | Summary: Environment variables required by AiDocs for AI chat, Mixedbread retrieval, proxy mode, and production URL configuration.
- [Deploy to Vercel](pages/deployment.md) | URL: /docs/deployment | Type: guide | Summary: Deploy a AiDocs site to Vercel with the required project settings, environment variables, and private-package access.
- [Migration guide](pages/migration.md) | URL: /docs/migration | Type: guide | Summary: Move an existing documentation site to @ai-toolkit/ai-docs while keeping local content, routing, middleware behavior, and AI-readable surfaces intact.
- [Configuration](pages/configuration.md) | URL: /docs/configuration | Type: reference | Summary: Configure site metadata, navigation, AI features, page actions, translations, and local adapters.
- [Syntax](pages/syntax.md) | URL: /docs/syntax | Type: reference | Summary: Supported MDX syntax including text formatting, code blocks, line highlighting, and Mermaid diagrams.
- [AiDocs Provider](pages/provider.md) | URL: /docs/provider | Type: reference | Summary: The root provider component that wraps your application to handle toast notifications, search, and analytics.
- [Versioned docs](pages/versioned-docs.md) | URL: /docs/versioned-docs | Type: guide | Summary: Use createVersionedSources to configure stable, pre-release, or host-based documentation versions.
- [Proxy and markdown routes](pages/proxy.md) | URL: /docs/proxy | Type: reference | Summary: Configure createProxy with generated route discovery, request hooks, markdown mappings, and a static Next.js matcher.
- [.md Extension](pages/md.md) | URL: /docs/md | Type: conceptual | Summary: Access any documentation page as raw Markdown by appending .md or .mdx to the URL for AI tool consumption.
- [Agent readiness](pages/agent-readiness.md) | URL: /docs/agent-readiness | Type: guide | Summary: Generate /agents.md and /.well-known/mcp.json from AiDocs config so agents can find docs, Markdown surfaces, API specs, and MCP endpoints.
- [Ask AI](pages/ask-ai.md) | URL: /docs/ask-ai | Type: conceptual | Summary: An AI-powered chat assistant with context-aware search, persistent history, and suggested prompts for your documentation.
- [Configure sidebar navigation](pages/guides/nested-navigation.md) | URL: /docs/guides/nested-navigation | Type: guide | Summary: Configure sidebar order, section labels, folder landing pages, and deeply nested page trees with meta.json files.
- [Edit on GitHub](pages/edit-on-github.md) | URL: /docs/edit-on-github | Type: integration | Summary: A direct link on every documentation page that lets readers propose changes through GitHub pull requests.
- [Feedback](pages/feedback.md) | URL: /docs/feedback | Type: integration | Summary: An interactive feedback widget that collects user sentiment and creates structured GitHub Issues automatically.
- [Improve Ask AI answers with Mixedbread](pages/mixedbread-retrieval.md) | URL: /docs/mixedbread-retrieval | Type: guide | Summary: Provision a Mixedbread Store for one AiDocs consumer site, enable semantic retrieval, and sync documentation during production builds.
- [Internationalization](pages/internationalization.md) | URL: /docs/internationalization | Type: guide | Summary: Serve documentation in multiple languages with automatic translation via the AiDocs CLI and Fumadocs routing.
- [llms.txt](pages/llms-txt.md) | URL: /docs/llms-txt | Type: conceptual | Summary: A single endpoint that returns all documentation as plain Markdown text following the llms.txt standard.
- [Open in Chat](pages/open-in-chat.md) | URL: /docs/open-in-chat | Type: conceptual | Summary: Transfer documentation context to AI chat platforms like ChatGPT, Claude, Cursor, and v0 with a single click.
- [RSS](pages/rss.md) | URL: /docs/rss | Type: conceptual | Summary: An automatically generated RSS 2.0 feed that keeps users informed when documentation is published or updated.
- [Table of contents](pages/table-of-contents.md) | URL: /docs/table-of-contents | Type: reference | Summary: AiDocs builds the "On this page" outline from your headings, indents sub-headings under their parent, and tracks the active section along a straight vertical guide rail.
- [Theme-Aware Image](pages/theme-aware-image.md) | URL: /docs/theme-aware-image | Type: reference | Summary: A component that swaps images based on the active theme, built on top of Next.js Image.
