import { anthropicWebSearchAgent } from '@/agent/anthropic-web-search-agent';
import { createAgentUIStreamResponse } from '@ai-toolkit/ai';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicWebSearchAgent,
    uiMessages: body.messages,
    sendSources: true,
  });
}
