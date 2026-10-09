import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { generateImageTool } from '@/tool/generate-image-tool';

export const openaiImageGenerationCustomToolAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  tools: {
    image: generateImageTool,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: 3 });
  },
});

export type OpenAIImageGenerationCustomToolMessage = InferAgentUIMessage<
  typeof openaiImageGenerationCustomToolAgent
>;
