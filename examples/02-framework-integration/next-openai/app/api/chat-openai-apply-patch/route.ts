import { openaiApplyPatchAgent } from '@/agent/openai-apply-patch-agent';
import { createAgentUIStreamResponse } from '@ai-toolkit/ai';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiApplyPatchAgent,
    uiMessages: body.messages,
  });
}
