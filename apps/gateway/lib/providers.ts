import { createAnthropic } from '@ai-toolkit/anthropic';
import { createGoogleGenerativeAI } from '@ai-toolkit/google';
import { createGroq } from '@ai-toolkit/groq';
import { createMistral } from '@ai-toolkit/mistral';
import { createOpenAI } from '@ai-toolkit/openai';
import type { LanguageModel } from '@ai-toolkit/ai';

type ProviderFactory = (apiKey: string, model: string) => LanguageModel;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`provider is not configured (missing ${name})`);
  }
  return value;
}

const factories: Record<string, { envVar: string; create: ProviderFactory }> = {
  openai: {
    envVar: 'OPENAI_API_KEY',
    create: (apiKey, model) => createOpenAI({ apiKey })(model),
  },
  anthropic: {
    envVar: 'ANTHROPIC_API_KEY',
    create: (apiKey, model) => createAnthropic({ apiKey })(model),
  },
  google: {
    envVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
    create: (apiKey, model) => createGoogleGenerativeAI({ apiKey })(model),
  },
  groq: {
    envVar: 'GROQ_API_KEY',
    create: (apiKey, model) => createGroq({ apiKey })(model),
  },
  mistral: {
    envVar: 'MISTRAL_API_KEY',
    create: (apiKey, model) => createMistral({ apiKey })(model),
  },
};

/** Provider IDs with server-held credentials in Phase 1. Extend to add more. */
export function supportedProviders(): string[] {
  return Object.keys(factories);
}

/** Build a language model for a routing decision using server-held credentials. */
export function createProviderModel(
  provider: string,
  model: string,
): LanguageModel {
  const entry = factories[provider];
  if (!entry) {
    throw new Error(
      `unsupported provider "${provider}" (supported: ${supportedProviders().join(', ')})`,
    );
  }
  return entry.create(requiredEnv(entry.envVar), model);
}
