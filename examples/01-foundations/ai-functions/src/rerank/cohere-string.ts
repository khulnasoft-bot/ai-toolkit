import { rerank } from '@ai-toolkit/ai';
import { type CohereRerankingOptions, cohere } from '@ai-toolkit/cohere';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await rerank({
    model: cohere.reranking('rerank-v3.5'),
    documents: ['sunny day at the beach', 'rainy day in the city'],
    query: 'talk about rain',
    topN: 2,
    providerOptions: {
      cohere: {
        priority: 1,
      } satisfies CohereRerankingOptions,
    },
  });

  print('Reranking:', result.ranking);
});
