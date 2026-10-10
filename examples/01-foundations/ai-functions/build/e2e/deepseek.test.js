import 'dotenv/config';
import { deepseek as provider, } from '@ai-toolkit/deepseek';
import { expect } from 'vitest';
import { createFeatureTestSuite, createLanguageModelWithCapabilities, } from './feature-test-suite';
const createChatModel = (modelId) => createLanguageModelWithCapabilities(provider.chat(modelId));
createFeatureTestSuite({
    name: 'DeepSeek',
    models: {
        invalidModel: provider.chat('no-such-model'),
        languageModels: [createChatModel('deepseek-chat')],
    },
    timeout: 10000,
    customAssertions: {
        errorValidator: (error) => {
            expect(error.data.error.message === 'Model Not Exist').toBe(true);
        },
    },
})();
//# sourceMappingURL=deepseek.test.js.map