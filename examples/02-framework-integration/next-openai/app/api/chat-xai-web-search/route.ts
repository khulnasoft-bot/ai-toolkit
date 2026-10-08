import { xaiWebSearchAgent } from '@/agent/xai-web-search-agent';
import { createAgentUIStreamResponse } from '@ai-toolkit/ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: xaiWebSearchAgent,
    uiMessages: messages,
    sendSources: true,
  });
}
