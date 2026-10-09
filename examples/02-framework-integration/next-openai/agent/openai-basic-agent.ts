import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { type OpenAIResponsesProviderOptions, openai } from '@ai-toolkit/openai';

export const openaiBasicAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  providerOptions: {
    openai: {
      reasoningEffort: 'medium',
      reasoningSummary: 'detailed',
      // store: false,
    } satisfies OpenAIResponsesProviderOptions,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: Infinity });
  },
});

export type OpenAIBasicMessage = InferAgentUIMessage<typeof openaiBasicAgent>;
