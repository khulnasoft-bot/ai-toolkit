---
title: Ask AI
description: An AI-powered chat assistant that helps users understand your documentation with context-aware responses
type: conceptual
summary: An AI-powered chat assistant with context-aware search, persistent history, and suggested prompts for your documentation.
url: /docs/ask-ai
source: apps/template/content/docs/ask-ai.mdx
prerequisites:
  - /docs/env
related:
  - /docs/open-in-chat
  - /docs/llms-txt
  - /docs/mixedbread-retrieval
  - /docs/configuration
---

# Ask AI

The Ask AI feature provides an intelligent chat assistant built directly into your documentation. Users can ask questions about your docs and get instant, context-aware answers powered by AI. The assistant can search through your documentation, understand context, and provide helpful responses.

  Help me configure Ask AI for this AiDocs site. Check my AI prompt, suggestions, environment variables, and search route, then recommend improvements for the assistant experience.

## How it works

The AI chat assistant is available in two ways:

### 1. Per-Page Quick Access

Each documentation page has an "Ask AI about this page" button in the table of contents sidebar. When clicked, it:

1. Opens the chat interface
2. Pre-fills a prompt asking the AI to read the current page
3. Allows users to ask specific questions about that page

### 2. Global Chat Interface

Users can open the chat interface at any time by:

- Clicking the "Ask AI" button in the navbar
- Using the keyboard shortcut: `⌘I` (Mac) or `Ctrl+I` (Windows/Linux)

Once open, users can:

- Ask questions about any part of your documentation
- Upload files or images for context
- View AI-powered search results from your docs
- Get step-by-step guidance on complex topics

## Add a chat footer

Set `ai.footer` to render content below the chat prompt in the desktop panel and mobile drawer. Use it for attribution, links, or other site-specific calls to action.

```tsx title="ai-docs.tsx"
export const ai = {
  footer: (
    <a href="https://example.com">
      Powered by your AI provider
    </a>
  ),
};
```

## AI SDK dependency ownership

AiDocs Ask AI is built on AI SDK v6. Generated projects install `ai` v6 and `@ai-sdk/react` v3, and `@ai-toolkit/ai-docs` owns the chat client, transport, and `createChatRoute` server behavior.

When a consumer app already uses the AI SDK outside AiDocs, treat that as app code. Upgrade the app code to the installed AI SDK version or let the package manager install separate versions if needed. Do not fork AiDocs chat internals or downgrade Ask AI to match unrelated app usage.

Most projects should not customize the chat transport. If you do customize `DefaultChatTransport.prepareSendMessagesRequest`, preserve `messages` in the returned request body. The AI SDK passes `messages` separately from `body`, and returning a custom `body` replaces the default request body.

```ts
prepareSendMessagesRequest: ({ body, messages }) => ({
  body: {
    ...body,
    messages,
    currentRoute: pathname,
  },
});
```

## Choose an AI mode

Ask AI can run in the default AI Gateway mode, through a Vertex-backed proxy, or answered by a hosted eve framework agent.

### Default AI Gateway mode

Use the default mode when the AiDocs site should call the Vercel AI Gateway directly.

1. Leave `GEISTDOCS_CHAT_PROXY_URL` unset.
2. Set `AI_GATEWAY_API_KEY` for local development. Vercel sets this automatically for deployments that have AI Gateway access.
3. Keep `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` set to the site's production host, such as `docs.example.com` or `localhost:3000` for local development.

In this mode, AiDocs uses the local `search_docs` tool during the AI SDK `streamText` loop.

#### Choose a model

Pass the `model` option to `createChatRoute` to control which model answers Ask AI requests. It accepts any AI SDK `LanguageModel`, including AI Gateway model strings, and defaults to `openai/gpt-4.1-mini`.

```ts title="app/api/chat/route.ts"
import { createChatRoute } from "@ai-toolkit/ai-docs/routes/chat";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { POST, maxDuration } = createChatRoute({
  config,
  model: "xai/grok-4.5",
  sources: [aiDocsSource],
});
```

The `model` option only applies in AI Gateway mode. In proxy mode, the Vertex-backed service selects the model.

### Vertex-backed proxy mode

Use proxy mode when Ask AI should route model requests through a central Vertex-backed service instead of calling AI Gateway from each site.

1. Deploy or use the central AiDocs platform proxy that exposes `POST /vertex`.
2. Configure the Vertex deployment to trust the AiDocs platform Vercel project with Deployment Protection Trusted Sources.
3. Set `GEISTDOCS_CHAT_PROXY_URL` on the AiDocs site to the platform proxy URL, including `/vertex`:

```txt
https://<ai-docs-platform-deployment>/vertex
```

4. Leave `GEISTDOCS_CHAT_PROXY_TOKEN` unset unless you are using a custom proxy that requires bearer authentication.

When `GEISTDOCS_CHAT_PROXY_URL` is set, AiDocs searches local docs on the first user message, injects the current page and related docs into the final user message, forwards `{ messages, platform: "vercel" }` to the proxy, and streams the AI SDK UI stream response back to the browser.

The platform proxy forwards a Vercel OIDC token to Vertex in the `x-vercel-trusted-oidc-idp-token` header. The Vertex deployment should validate the caller through Trusted Sources; the AiDocs site does not need a Vertex API key.

### Hosted eve agent mode

Use eve agent mode when a hosted [eve framework](https://eve.dev) agent should answer Ask AI requests. Configure it with a single field in `ai-docs.tsx`:

```tsx title="ai-docs.tsx"
export const ai = {
  eveAgent: { url: "https://help-eve.example.dev" },
};
```

The URL flows to `createChatRoute` through the config object you already pass in `app/api/chat/route.ts` — no route changes are required. AiDocs speaks eve's session API directly: it starts or resumes a durable eve session, streams the agent's NDJSON events, and translates them into the same UI message stream the chat panel already renders. Conversation continuity is handled automatically by round-tripping the eve session handle through message metadata.

Eve agent mode keeps the platform-owned behavior from proxy mode:

- Local docs retrieval runs on the first user message, and the current page plus related docs are inlined into the message the agent receives.
- Locally computed source citations are injected into the response stream, and `excludeFrom: [chat]` page visibility is enforced before anything reaches the agent.
- The agent's reasoning shows as a "Thinking..." indicator, its tool calls show as activity labels, and stopping a response cancels the in-flight eve turn.

**Authentication.** Requests carry a Vercel OIDC token minted per request, in two headers for the two layers that may guard the agent: `Authorization: Bearer` for eve's channel auth, and `x-vercel-trusted-oidc-idp-token` for Vercel Deployment Protection. Eve's default channel auth (`vercelOidc()`) accepts deployments from the same Vercel team out of the box; cross-team agents can allow the site with `vercelSubject`. If the agent deployment uses Deployment Protection, add the docs site's project as a Trusted Source. For agents with custom auth, pass server-only headers through the `eveAgent` option:

```ts title="app/api/chat/route.ts"
export const { POST, maxDuration } = createChatRoute({
  config,
  sources: [aiDocsSource],
  eveAgent: {
    headers: async () => ({ authorization: `Bearer ${await mintToken()}` }),
  },
});
```

Never put authentication material in `ai-docs.tsx` — the config ships to the client bundle. The agent URL is public configuration; tokens are not.

The `eveAgent` option also accepts a `url` override for pointing staging deployments at a different agent. Configuring both `proxy` and an eve agent throws at route creation.

## Features

### Context-Aware Search

By default, the AI assistant includes a built-in `search_docs` tool that:

1. Searches through your documentation content
2. Finds relevant pages based on the user's question
3. Shows source citations with links to the referenced pages
4. Uses the content to provide accurate, contextual answers

When `GEISTDOCS_CHAT_PROXY_URL` is set, AiDocs runs local documentation retrieval on the first user message before forwarding the request to the configured proxy. This gives proxy-backed services access to the current page and related local documentation without requiring them to read the site's source files directly.

Set `ai.retrieval` to `"mixedbread"` to replace local keyword retrieval with semantic retrieval for default, proxy, and hosted eve modes. Mixedbread returns the matching content chunk, while the AI model and the visible search dialog remain unchanged. AiDocs falls back to local Orama retrieval when Mixedbread is unavailable. Read [Improve Ask AI answers with Mixedbread](/docs/mixedbread-retrieval) to provision a Store and configure production sync.

### Persistent Chat History

Conversations are automatically saved to the browser's IndexedDB, providing:

- Chat history that persists across page reloads
- Ability to continue previous conversations
- Option to start a new chat or clear history
- Offline access to past conversations

### Interactive Features

- **Suggestions**: First-time users see suggested questions to get started
- **File Upload**: Users can attach files or images for context
- **Markdown Support**: Responses are formatted with proper Markdown rendering
- **Code Syntax Highlighting**: Code blocks in responses include syntax highlighting
- **Reasoning Display**: In development mode, view the AI's reasoning process

### Mobile-Responsive

The chat interface adapts to different screen sizes:

- **Desktop**: Slides in from the right side as a sidebar panel
- **Mobile**: Opens as a bottom drawer.

## Configuration

The environment variables `AI_GATEWAY_API_KEY` and `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` must be set for the default AI Gateway mode. Set `GEISTDOCS_CHAT_PROXY_URL` to route Ask AI through a Vertex-backed proxy instead. You can read more in the [Environment Variables](/docs/env) section.

In default AI Gateway mode, AiDocs uses `openai/gpt-4.1-mini` via the Vercel AI Gateway. In Vertex-backed proxy mode, the configured proxy controls the upstream model.

## Suggested Prompts

You can customize the initial suggested prompts shown to users. These are configured in the AiDocs configuration file, which you can read more about in the [Configuration](/docs/configuration) section.
