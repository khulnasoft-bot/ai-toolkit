import { luma as provider } from '@ai-toolkit/luma';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createImageModelWithCapabilities,
} from './feature-test-suite';
import 'dotenv/config';
createFeatureTestSuite({
  name: 'Luma',
  models: {
    invalidImageModel: provider.image('no-such-model'),
    imageModels: [
      createImageModelWithCapabilities(provider.image('photon-flash-1')),
      createImageModelWithCapabilities(provider.image('photon-1')),
    ],
  },
  timeout: 30000,
  customAssertions: {
    errorValidator: error => {
      expect(error.data.detail[0].msg).toMatch(/Input should be/i);
    },
  },
})();
//# sourceMappingURL=luma.test.js.map
