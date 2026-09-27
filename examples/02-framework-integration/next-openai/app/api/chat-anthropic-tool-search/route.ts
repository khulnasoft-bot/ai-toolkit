import { anthropicToolSearchAgent } from '@/agent/anthropic-tool-search-agent';
import { createAgentUIStreamResponse } from '@ai-toolkit/ai';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicToolSearchAgent,
    uiMessages: body.messages,
  });
}
