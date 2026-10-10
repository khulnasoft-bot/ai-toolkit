import 'dotenv/config';
import { gateway as provider } from '@ai-toolkit/gateway';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';
const createChatModel = modelId =>
  createLanguageModelWithCapabilities(provider.languageModel(modelId));
createFeatureTestSuite({
  name: 'Gateway',
  models: {
    languageModels: [createChatModel('xai/grok-3-beta')],
  },
  timeout: 30000,
})();
//# sourceMappingURL=gateway.test.js.map
