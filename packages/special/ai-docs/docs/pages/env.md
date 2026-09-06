---
title: Environment Variables
description: Learn about the environment variables used in AiDocs
type: reference
summary: Environment variables required by AiDocs for AI chat, Mixedbread retrieval, proxy mode, and production URL configuration.
url: /docs/env
source: apps/template/content/docs/env.mdx
prerequisites:
  - /docs/getting-started
related:
  - /docs/configuration
  - /docs/deployment
---

# Environment Variables

AiDocs uses environment variables to configure Ask AI, optional Mixedbread retrieval, optional Vertex-backed proxy mode, and production URL behavior.

  Review this AiDocs project and help me configure the required environment variables. Check whether `AI_GATEWAY_API_KEY`, `MXBAI_API_KEY`, `MXBAI_STORE_ID`, `GEISTDOCS_CHAT_PROXY_URL`, and `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` are needed for the features I enabled, then tell me where to set them locally and on Vercel.

## `AI_GATEWAY_API_KEY`

The API key for the AI Gateway. This is used to power the default local AI chat functionality when `GEISTDOCS_CHAT_PROXY_URL` is not set.

> This is automatically set when deploying to Vercel.

Leave `GEISTDOCS_CHAT_PROXY_URL` unset to use AI Gateway mode.

## `MXBAI_API_KEY`

The server-only API key for Mixedbread retrieval. The Mixedbread Vercel Marketplace integration injects this value when you provision a Store and connect it to the consumer site's Vercel project.

## `MXBAI_STORE_ID`

The Mixedbread Store used by one consumer site. Set `ai.retrieval` to `"mixedbread"` and configure a unique `siteId` before using this value.

Provision the Store by running `vercel integration add mixedbread` from the root of the consumer site's repository, where Vercel CLI is linked to that site's project. Do not run the provisioning command from the AiDocs package repository. Read [Improve Ask AI answers with Mixedbread](/docs/mixedbread-retrieval) for the complete setup.

## `GEISTDOCS_CHAT_PROXY_URL`

An optional URL for a chat proxy. When set, AiDocs searches the local documentation on the first user message, injects the current page and related docs as context, and forwards the request to this proxy.

Use this when routing Ask AI through a central Vertex-backed service. The value should point at the AiDocs platform proxy and include `/vertex`:

```txt
https://<ai-docs-platform-deployment>/vertex
```

When this variable is set, the site does not need `AI_GATEWAY_API_KEY` for Ask AI requests. The platform proxy calls Vertex and forwards a Vercel OIDC token in `x-vercel-trusted-oidc-idp-token` so the Vertex deployment can validate the caller through Deployment Protection Trusted Sources.

## `GEISTDOCS_CHAT_PROXY_TOKEN`

An optional bearer token for the chat proxy. Only set this if your proxy requires an `Authorization` header.

The default AiDocs platform `/vertex` proxy uses Vercel OIDC and Trusted Sources, so it does not require this token.

## Vertex-backed proxy setup

To route Ask AI through Vertex:

1. Use or deploy the central AiDocs platform proxy with its `/vertex` route.
2. In the Vertex deployment's Deployment Protection settings, add the AiDocs platform Vercel project as a Trusted Source.
3. In each AiDocs site that should use Vertex, set `GEISTDOCS_CHAT_PROXY_URL` to the platform proxy URL, including `/vertex`.
4. Leave `GEISTDOCS_CHAT_PROXY_TOKEN` unset unless you replace the platform proxy with a custom bearer-authenticated proxy.

The Vertex deployment does not need a AiDocs-specific environment variable. Access is controlled by Trusted Sources and the OIDC token forwarded by the platform proxy.

## `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`

The production URL of the AiDocs site. AiDocs uses it for canonical and Open Graph metadata, product JSON-LD, `sitemap.xml`, `robots.txt`, and RSS links. Vercel sets this variable automatically.

Set this variable explicitly when deploying outside Vercel. Use a hostname such as `docs.example.com` or a full `http` or `https` URL. Local development falls back to `http://localhost:3000`. A production build with a missing or malformed value emits a warning and omits default canonical and product JSON-LD URLs. Its `sitemap.xml`, `robots.txt` sitemap directive, RSS links, and generated Open Graph image URLs continue to use the localhost fallback, so treat the warning as a deployment blocker. AiDocs does not use the deployment-specific `VERCEL_URL` for canonical surfaces.
