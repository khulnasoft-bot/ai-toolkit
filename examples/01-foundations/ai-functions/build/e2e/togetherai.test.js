import 'dotenv/config';
import { togetherai as provider } from '@ai-toolkit/togetherai';
import { expect } from 'vitest';
import {
  createEmbeddingModelWithCapabilities,
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';
const createChatModel = modelId =>
  createLanguageModelWithCapabilities(provider.chatModel(modelId));
const createCompletionModel = modelId =>
  createLanguageModelWithCapabilities(provider.completionModel(modelId), [
    'textCompletion',
  ]);
createFeatureTestSuite({
  name: 'TogetherAI',
  models: {
    invalidModel: provider.chatModel('no-such-model'),
    languageModels: [
      createChatModel('deepseek-ai/DeepSeek-V3'), // no tools, objects, or images
      createChatModel('meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'),
      createChatModel('mistralai/Mistral-7B-Instruct-v0.1'),
      createChatModel('google/gemma-2b-it'),
      createChatModel('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
      createChatModel('mistralai/Mixtral-8x7B-Instruct-v0.1'),
      createChatModel('Qwen/Qwen2.5-72B-Instruct-Turbo'),
      createChatModel('databricks/dbrx-instruct'),
      createCompletionModel('Qwen/Qwen2.5-Coder-32B-Instruct'),
    ],
    embeddingModels: [
      createEmbeddingModelWithCapabilities(
        provider.embeddingModel('togethercomputer/m2-bert-80M-8k-retrieval'),
      ),
      createEmbeddingModelWithCapabilities(
        provider.embeddingModel('BAAI/bge-base-en-v1.5'),
      ),
    ],
  },
  timeout: 10000,
  customAssertions: {
    skipUsage: true,
    errorValidator: error => {
      expect(error.data.error.message).toMatch(/^Unable to access model/);
    },
  },
})();
//# sourceMappingURL=togetherai.test.js.map
