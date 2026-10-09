import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

import { z } from 'zod';

export const exampleMetadataSchema = z.object({
  createdAt: z.number().optional(),
  duration: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  finishReason: z.string().optional(),
});

export type ExampleMetadata = z.infer<typeof exampleMetadataSchema>;

export const openaiMetadataAgent = new ToolLoopAgent({
  model: openai('gpt-4o'),
});

export type OpenAIMetadataMessage = InferAgentUIMessage<
  typeof openaiMetadataAgent,
  ExampleMetadata
>;
