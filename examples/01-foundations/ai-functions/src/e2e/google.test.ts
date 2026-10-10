import { type GoogleErrorData, google as provider } from '@ai-toolkit/google';
import type {
  APICallError,
  ImageModelV3,
  LanguageModelV3,
} from '@ai-toolkit/provider';
import 'dotenv/config';
import { defaultSettingsMiddleware, wrapLanguageModel } from '@ai-toolkit/ai';
import { expect } from 'vitest';
import {
  createEmbeddingModelWithCapabilities,
  createFeatureTestSuite,
  createImageModelWithCapabilities,
  createLanguageModelWithCapabilities,
  defaultChatModelCapabilities,
  type ModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (
  modelId: string,
): ModelWithCapabilities<LanguageModelV3> =>
  createLanguageModelWithCapabilities(provider.chat(modelId));

const createImageModel = (
  modelId: string,
): ModelWithCapabilities<ImageModelV3> =>
  createImageModelWithCapabilities(provider.image(modelId));

const createSearchGroundedModel = (
  modelId: string,
): ModelWithCapabilities<LanguageModelV3> => {
  const model = provider.chat(modelId);
  return {
    model: wrapLanguageModel({
      model,
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: { google: { useSearchGrounding: true } },
        },
      }),
    }),
    capabilities: [...defaultChatModelCapabilities, 'searchGrounding'],
  };
};

createFeatureTestSuite({
  name: 'Google Generative AI',
  models: {
    invalidModel: provider.chat('no-such-model'),
    languageModels: [
      createSearchGroundedModel('gemini-1.5-flash-latest'),
      createChatModel('gemini-1.5-flash-latest'),
      // Gemini 2.0 and Pro models have low quota limits and may require billing enabled.
      // createChatModel('gemini-2.0-flash-exp'),
      // createSearchGroundedModel('gemini-2.0-flash-exp'),
      // createChatModel('gemini-1.5-pro-latest'),
      // createChatModel('gemini-1.0-pro'),
    ],
    embeddingModels: [
      createEmbeddingModelWithCapabilities(
        provider.embeddingModel('gemini-embedding-001'),
      ),
    ],
    imageModels: [createImageModel('imagen-3.0-generate-002')],
  },
  timeout: 20000,
  customAssertions: {
    skipUsage: true,
    errorValidator: (error: APICallError) => {
      console.log(error);
      expect((error.data as GoogleErrorData).error.message).match(
        /models\/no-such-model is not found/,
      );
    },
  },
})();
