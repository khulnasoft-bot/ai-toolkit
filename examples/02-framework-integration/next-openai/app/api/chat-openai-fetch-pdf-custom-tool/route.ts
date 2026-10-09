import { createAgentUIStreamResponse } from '@ai-toolkit/ai';
import { openaiFetchPdfCustomToolAgent } from '@/agent/openai-fetch-pdf-custom-tool-agent';

export async function POST(request: Request) {
  const body = await request.json();

  console.dir(body.messages, { depth: Infinity });

  return createAgentUIStreamResponse({
    agent: openaiFetchPdfCustomToolAgent,
    uiMessages: body.messages,
  });
}
