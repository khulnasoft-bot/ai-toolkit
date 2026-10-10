import { google as provider } from '@ai-toolkit/google';
import 'dotenv/config';
import { defaultSettingsMiddleware, wrapLanguageModel } from '@ai-toolkit/ai';
import { expect } from 'vitest';
import { createEmbeddingModelWithCapabilities, createFeatureTestSuite, createImageModelWithCapabilities, createLanguageModelWithCapabilities, defaultChatModelCapabilities, } from './feature-test-suite';
const createChatModel = (modelId) => createLanguageModelWithCapabilities(provider.chat(modelId));
const createImageModel = (modelId) => createImageModelWithCapabilities(provider.image(modelId));
const createSearchGroundedModel = (modelId) => {
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
            createEmbeddingModelWithCapabilities(provider.embeddingModel('gemini-embedding-001')),
        ],
        imageModels: [createImageModel('imagen-3.0-generate-002')],
    },
    timeout: 20000,
    customAssertions: {
        skipUsage: true,
        errorValidator: (error) => {
            console.log(error);
            expect(error.data.error.message).match(/models\/no-such-model is not found/);
        },
    },
})();
//# sourceMappingURL=google.test.js.map