// @ts-nocheck
import {
  MockEmbeddingModelV2,
  MockImageModelV2,
  MockLanguageModelV2,
  MockProviderV2,
  MockSpeechModelV2,
  MockTranscriptionModelV2,
} from 'ai/test';

const _languageModel = new MockLanguageModelV2();

const _embeddingModel = new MockEmbeddingModelV2();

const _imageModel = new MockImageModelV2();

const _provider = new MockProviderV2();

const _speechModel = new MockSpeechModelV2();

const _transcriptionModel = new MockTranscriptionModelV2();

// Type annotations
function _testWithModel(model: MockLanguageModelV2) {
  return model;
}

// Using as type parameter
const _models: MockLanguageModelV2[] = [];

// Function that returns a mock
function _createMock(): MockEmbeddingModelV2 {
  return new MockEmbeddingModelV2();
}

// In object type
interface TestConfig {
  model: MockLanguageModelV2;
  embedding: MockEmbeddingModelV2;
}
