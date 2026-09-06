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
