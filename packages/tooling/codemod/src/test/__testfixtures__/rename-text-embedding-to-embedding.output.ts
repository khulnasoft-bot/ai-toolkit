// @ts-nocheck

import { anthropic } from '@ai-toolkit/anthropic';
import { openai } from '@ai-toolkit/openai';
import { embed, embedMany } from 'ai';

// Using the full method name
const _model1 = openai.embeddingModel('text-embedding-3-small');

// Using the shorthand
const _model2 = openai.embedding('text-embedding-3-small');

// With other providers
const _model3 = anthropic.embeddingModel('some-model');
const _model4 = anthropic.embedding('some-model');

// In embed function
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});

// In embedMany function
const { embeddings } = await embedMany({
  model: openai.embeddingModel('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon'],
});

// Assigned to variable without immediate call
const _embeddingFn = openai.embedding;
const _embeddingModelFn = openai.embeddingModel;

// Chained usage
async function _getEmbedding(text: string) {
  return embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });
}
