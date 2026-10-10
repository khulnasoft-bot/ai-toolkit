import 'dotenv/config';
import { perplexity as provider } from '@ai-toolkit/perplexity';
import { expect } from 'vitest';
import { createFeatureTestSuite, createLanguageModelWithCapabilities, } from './feature-test-suite';
const createChatModel = (modelId) => createLanguageModelWithCapabilities(provider(modelId));
createFeatureTestSuite({
    name: 'perplexity',
    models: {
        invalidModel: provider('no-such-model'),
        languageModels: [createChatModel('sonar-pro'), createChatModel('sonar')],
    },
    timeout: 30000,
    customAssertions: {
        errorValidator: (error) => {
            expect(error.data.code).toBe('Some requested entity was not found');
        },
    },
})();
//# sourceMappingURL=perplexity.test.js.map