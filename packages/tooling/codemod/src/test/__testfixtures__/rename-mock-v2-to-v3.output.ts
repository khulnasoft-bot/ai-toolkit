// @ts-nocheck
import {
  MockEmbeddingModelV3,
  MockImageModelV3,
  MockLanguageModelV3,
  MockProviderV3,
  MockSpeechModelV3,
  MockTranscriptionModelV3,
} from 'ai/test';

const _languageModel = new MockLanguageModelV3();

const _embeddingModel = new MockEmbeddingModelV3();

const _imageModel = new MockImageModelV3();

const _provider = new MockProviderV3();

const _speechModel = new MockSpeechModelV3();

const _transcriptionModel = new MockTranscriptionModelV3();

// Type annotations
function _testWithModel(model: MockLanguageModelV3) {
  return model;
}

// Using as type parameter
const _models: MockLanguageModelV3[] = [];

// Function that returns a mock
function _createMock(): MockEmbeddingModelV3 {
  return new MockEmbeddingModelV3();
}

// In object type
interface TestConfig {
  model: MockLanguageModelV3;
  embedding: MockEmbeddingModelV3;
}
