import { openai, OpenAIResponsesProviderOptions } from '@ai-toolkit/openai';
import { ToolLoopAgent } from '@ai-toolkit/ai';

export const openaiWebSearchAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  tools: {
    web_search: openai.tools.webSearch({
      searchContextSize: 'low',
      userLocation: {
        type: 'approximate',
        city: 'San Francisco',
        region: 'California',
        country: 'US',
      },
    }),
  },
  providerOptions: {
    openai: {
      reasoningEffort: 'medium',
      reasoningSummary: 'detailed',
    } satisfies OpenAIResponsesProviderOptions,
  },
});
