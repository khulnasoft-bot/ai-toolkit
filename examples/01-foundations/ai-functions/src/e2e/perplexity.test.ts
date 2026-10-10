import 'dotenv/config';
import { perplexity as provider } from '@ai-toolkit/perplexity';
import type { APICallError } from '@ai-toolkit/provider';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider(modelId));

createFeatureTestSuite({
  name: 'perplexity',
  models: {
    invalidModel: provider('no-such-model'),
    languageModels: [createChatModel('sonar-pro'), createChatModel('sonar')],
  },
  timeout: 30000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect((error.data as any).code).toBe(
        'Some requested entity was not found',
      );
    },
  },
})();
