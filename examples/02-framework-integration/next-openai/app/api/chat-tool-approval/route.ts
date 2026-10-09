import { createAgentUIStreamResponse } from '@ai-toolkit/ai';
import { weatherWithApprovalAgent } from '@/agent/weather-with-approval-agent';

export async function POST(request: Request) {
  const body = await request.json();

  console.dir(body.messages, { depth: Infinity });

  return createAgentUIStreamResponse({
    agent: weatherWithApprovalAgent,
    uiMessages: body.messages,
  });
}
