// @ts-nocheck
import type { EmbeddingModelUsage, LanguageModelUsage } from 'ai';

function _recordUsage(usage: LanguageModelUsage) {
  console.log(usage);
}

function _processEmbedding(usage: EmbeddingModelUsage) {
  console.log(usage);
}

const _handler = (data: LanguageModelUsage) => {
  console.log(data);
};
