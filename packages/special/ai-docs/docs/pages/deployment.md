---
title: Deploy to Vercel
description: Learn how to deploy your AiDocs site to Vercel
type: guide
summary: Deploy a AiDocs site to Vercel with the required project settings, environment variables, and private-package access.
url: /docs/deployment
source: apps/template/content/docs/deployment.mdx
prerequisites:
  - /docs/getting-started
  - /docs/env
related:
  - /docs/configuration
---

# Deploy to Vercel

Deploy a AiDocs site to Vercel as a Next.js app. Configure package access, environment variables, and the production URL before shipping.

  Help me deploy this AiDocs project to Vercel. Check whether it uses the Geistcn canary and therefore needs private npm access, then review the package scripts, environment variables, GitHub Actions authentication, and Vercel project settings.

## Prerequisites

Before deploying, you need:

- A [GitHub account](https://github.com) with your AiDocs repository
- A [Vercel account](https://vercel.com) (sign up at [vercel.com](https://vercel.com))
- Your Vercel account connected to your GitHub account
- Environment variables ready (see [Environment Variables](/docs/env))
- Access to restricted `@vercel` npm packages if the project uses the Geistcn canary

## Configure private package access

The Geistcn canary depends on restricted `@vercel/geistcn` and `@vercel/geistcn-assets` packages. Package installation fails without npm authentication.

For a Vercel deployment, ask `#help-core-platform` to add your Vercel project to the shared `NPM_TOKEN` environment variable list. Include the project link and the environments that need access. When `NPM_TOKEN` is available, Vercel creates the npm authentication configuration before installing dependencies. Do not copy the shared token into your repository or project documentation.

For GitHub Actions, ask `#help-it` to add your repository to the allowlist for the `NPM_TOKEN` organization secret. Pass that secret to npm authentication during the install job:

```yaml title=".github/workflows/check.yml"
- uses: pnpm/action-setup@v4

- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: pnpm
    registry-url: https://registry.npmjs.org

- run: pnpm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Read [How do I use private dependencies with Vercel?](https://vercel.com/kb/guide/using-private-dependencies-with-vercel) for the platform's npm authentication behavior.

## Deploy to Vercel

To deploy from the Vercel dashboard:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select your AiDocs repository
3. Configure your project settings:
   - **Framework Preset**: Next.js (automatically detected)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`
4. Add your environment variables (see [Environment Variables](/docs/env))
5. Click "Deploy"

## Deploy with Vertex-backed Ask AI

If your site routes Ask AI through the central Vertex-backed proxy, configure both the AiDocs site and the Vertex deployment before testing production chat.

1. Set `GEISTDOCS_CHAT_PROXY_URL` on the AiDocs site to the platform proxy URL, including `/vertex`.
2. Leave `GEISTDOCS_CHAT_PROXY_TOKEN` unset unless your proxy requires bearer authentication.
3. Add the AiDocs platform Vercel project as a Trusted Source in the Vertex deployment's Deployment Protection settings.
4. Confirm the platform proxy can forward the Vercel OIDC token to Vertex in `x-vercel-trusted-oidc-idp-token`.

The AiDocs site does not need Vertex credentials. The platform proxy authenticates to Vertex with Vercel OIDC and Trusted Sources.
