import { createAgentUIStreamResponse } from '@ai-toolkit/ai';
import { weatherValibotAgent } from '@/agent/weather-valibot-agent';

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.dir(messages, { depth: Infinity });

  return createAgentUIStreamResponse({
    agent: weatherValibotAgent,
    uiMessages: messages,
  });
}
