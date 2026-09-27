import { anthropic } from '@ai-toolkit/anthropic';
import { elevenlabs } from '@ai-toolkit/elevenlabs';
import { fal } from '@ai-toolkit/fal';
import { groq } from '@ai-toolkit/groq';
import { luma } from '@ai-toolkit/luma';
import { mistral } from '@ai-toolkit/mistral';
import { openai } from '@ai-toolkit/openai';
import { replicate } from '@ai-toolkit/replicate';
import { xai } from '@ai-toolkit/xai';
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from '@ai-toolkit/ai';
import 'dotenv/config';

// custom provider with alias names:
const myAnthropic = customProvider({
  languageModels: {
    opus: anthropic('claude-3-opus-20240229'),
    sonnet: anthropic('claude-3-5-sonnet-20240620'),
    haiku: anthropic('claude-3-haiku-20240307'),
  },
  fallbackProvider: anthropic,
});

// custom provider with different model settings:
const myOpenAI = customProvider({
  languageModels: {
    // replacement model with custom provider options:
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    // alias model with custom provider options:
    'gpt-4o-high-reasoning': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: openai,
});

export const registry = createProviderRegistry({
  mistral,
  anthropic: myAnthropic,
  openai: myOpenAI,
  xai,
  groq,
  elevenlabs,
});

registry.languageModel('anthropic:haiku');

const registryWithCustomSeparator = createProviderRegistry(
  {
    mistral,
    anthropic: myAnthropic,
    openai: myOpenAI,
    xai,
    groq,
    elevenlabs,
  },
  { separator: ' > ' },
);

registryWithCustomSeparator.languageModel('anthropic > haiku');

export const myImageModels = customProvider({
  imageModels: {
    recraft: fal.imageModel('recraft-v3'),
    photon: luma.imageModel('photon-flash-1'),
    flux: replicate.imageModel('black-forest-labs/flux-schnell'),
  },
});
