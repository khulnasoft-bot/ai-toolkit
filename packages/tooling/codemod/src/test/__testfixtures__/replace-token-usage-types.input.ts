// @ts-nocheck
import type { CompletionTokenUsage, EmbeddingTokenUsage, TokenUsage } from 'ai';

function _recordUsage(usage: TokenUsage) {
  console.log(usage);
}

function _processEmbedding(usage: EmbeddingTokenUsage) {
  console.log(usage);
}

const _handler = (data: CompletionTokenUsage) => {
  console.log(data);
};
