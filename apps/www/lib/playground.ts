export const PLAYGROUND_URL = 'https://studio.khulnasoft.com/playground';

export interface PlaygroundFeature {
  id: string;
  title: string;
  description: string;
}

export const playgroundFeatures: PlaygroundFeature[] = [
  {
    id: 'compare',
    title: 'Compare models side-by-side',
    description:
      'Run the same prompt across different models in one view and pick the winner for your use case.',
  },
  {
    id: 'stream',
    title: 'Real-time streaming',
    description:
      'Watch tokens arrive as they are generated, so you can feel latency and tone before you ship.',
  },
  {
    id: 'code',
    title: 'Code generation & editing',
    description:
      'Generate, explain, and refactor code with models tuned for the task, then export the result.',
  },
  {
    id: 'prompts',
    title: 'Prompt library',
    description:
      'Start from pre-built examples for creative writing, analysis, translation, and more.',
  },
  {
    id: 'export',
    title: 'Export as AI Toolkit code',
    description:
      'Tune a prompt and model in the playground, then generate ready-to-run AI Toolkit code.',
  },
];

export interface PlaygroundProvider {
  name: string;
  models: string;
  capabilities: string[];
}

export const playgroundProviders: PlaygroundProvider[] = [
  {
    name: 'OpenAI',
    models: 'GPT-5, GPT-4.1, o-series',
    capabilities: ['reasoning', 'vision', 'coding'],
  },
  {
    name: 'Anthropic',
    models: 'Claude 4 Opus, Sonnet, Haiku',
    capabilities: ['reasoning', 'coding', 'long-context'],
  },
  {
    name: 'Google',
    models: 'Gemini 2.0 Pro, Flash',
    capabilities: ['multimodal', 'fast', 'long-context'],
  },
  {
    name: 'xAI',
    models: 'Grok 3, Grok 3 Fast',
    capabilities: ['reasoning', 'coding'],
  },
  {
    name: 'Groq',
    models: 'Llama 3, Mixtral',
    capabilities: ['fast', 'open-source'],
  },
  {
    name: 'Mistral',
    models: 'Mistral Large, Mixtral',
    capabilities: ['efficient', 'open-source'],
  },
  {
    name: 'Cohere',
    models: 'Command R, Command R+',
    capabilities: ['rag', 'tool-use'],
  },
  {
    name: 'Perplexity',
    models: 'Sonar, Sonar Large',
    capabilities: ['search', 'realtime'],
  },
  {
    name: 'Fireworks',
    models: 'FireLLaMA, Mixtral',
    capabilities: ['fast', 'open-source'],
  },
  {
    name: 'DeepSeek',
    models: 'DeepSeek V3, Coder',
    capabilities: ['reasoning', 'coding'],
  },
];

export interface SamplePrompt {
  title: string;
  prompt: string;
}

export const samplePrompts: SamplePrompt[] = [
  {
    title: 'Text generation',
    prompt:
      'Write a short launch email announcing the new AI Toolkit playground.',
  },
  {
    title: 'Code generation',
    prompt:
      'Write a TypeScript function that fetches a URL with retries and exponential backoff.',
  },
  {
    title: 'Creative writing',
    prompt: 'Write a haiku about distributed databases.',
  },
  {
    title: 'Translation',
    prompt:
      "Translate 'The stream has begun.' into Japanese, Spanish, and French.",
  },
];
