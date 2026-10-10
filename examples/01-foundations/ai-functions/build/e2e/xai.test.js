import 'dotenv/config';
import { xai as provider } from '@ai-toolkit/xai';
import { expect } from 'vitest';
import { createFeatureTestSuite, createLanguageModelWithCapabilities, } from './feature-test-suite';
const createChatModel = (modelId) => createLanguageModelWithCapabilities(provider.chat(modelId));
const createCompletionModel = (modelId) => createLanguageModelWithCapabilities(provider.languageModel(modelId), [
    'textCompletion',
]);
createFeatureTestSuite({
    name: 'xAI',
    models: {
        invalidModel: provider.chat('no-such-model'),
        languageModels: [
            createChatModel('grok-4'),
            createChatModel('grok-3-beta'),
            createChatModel('grok-3-fast-beta'),
            createChatModel('grok-3-mini-beta'),
            createChatModel('grok-3-mini-fast-beta'),
            createChatModel('grok-beta'),
            createChatModel('grok-2-1212'),
            createChatModel('grok-vision-beta'),
            createChatModel('grok-2-vision-1212'),
            createCompletionModel('grok-beta'),
            createCompletionModel('grok-2-1212'),
            createCompletionModel('grok-vision-beta'),
            createCompletionModel('grok-2-vision-1212'),
        ],
    },
    timeout: 30000,
    customAssertions: {
        errorValidator: (error) => {
            expect(error.data.error.message).toContain('model');
        },
    },
})();
//# sourceMappingURL=xai.test.js.map