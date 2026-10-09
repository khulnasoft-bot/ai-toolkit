// @ts-nocheck
import { experimental_createProviderRegistry, type Provider } from 'ai';

function createProvider(): Provider {
  return {
    languageModel: () => null,
    textEmbeddingModel: () => null,
  };
}

function createRegistry(): Provider {
  return experimental_createProviderRegistry({
    test: createProvider(),
  });
}

const _registry: Provider = createRegistry();
