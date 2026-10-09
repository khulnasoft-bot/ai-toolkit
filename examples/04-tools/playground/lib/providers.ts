export interface AIProvider {
  id: string;
  name: string;
  models: string[];
}

export const DEFAULT_MODEL = 'openai/gpt-4o';

export const aiProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'openai/gpt-4.1'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      'anthropic/claude-3-7-sonnet',
      'anthropic/claude-3-5-sonnet',
      'anthropic/claude-3-5-haiku',
    ],
  },
  {
    id: 'google',
    name: 'Google',
    models: ['google/gemini-2.5-pro', 'google/gemini-2.0-flash'],
  },
  {
    id: 'groq',
    name: 'Groq',
    models: ['groq/llama-3.3-70b-versatile', 'groq/mixtral-8x7b-32768'],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    models: ['mistral/mistral-large-latest', 'mistral/mixtral-8x7b-instruct'],
  },
  {
    id: 'xai',
    name: 'xAI',
    models: ['xai/grok-2', 'xai/grok-beta'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek/deepseek-chat', 'deepseek/deepseek-coder'],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    models: ['cohere/command-r-plus', 'cohere/command-r'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    models: ['perplexity/sonar', 'perplexity/sonar-pro'],
  },
];

export const allModels: string[] = aiProviders.flatMap(
  provider => provider.models,
);

export function getProvider(providerId: string) {
  return aiProviders.find(provider => provider.id === providerId);
}

export function isValidModel(modelId: string) {
  return allModels.includes(modelId);
}

export function resolveModelId(modelId: string): string {
  // String model IDs resolve through the AI Gateway by default
  // (see packages/ai/core/src/model/resolve-model.ts).
  // Unknown IDs are passed through so gateway(...) can still resolve them.
  return modelId;
}
