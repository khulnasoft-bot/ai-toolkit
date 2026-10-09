import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { fetchPdfTool } from '@/tool/fetch-pdf-tool';

export const openaiFetchPdfCustomToolAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  tools: {
    fetchPdf: fetchPdfTool,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: 3 });
  },
});

export type OpenAIFetchPdfCustomToolMessage = InferAgentUIMessage<
  typeof openaiFetchPdfCustomToolAgent
>;
