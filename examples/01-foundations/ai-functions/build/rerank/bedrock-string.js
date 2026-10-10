import { rerank } from '@ai-toolkit/ai';
import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { print } from '../lib/print';
import { run } from '../lib/run';
run(async () => {
  const result = await rerank({
    model: bedrock.reranking('amazon.rerank-v1:0'),
    documents: ['sunny day at the beach', 'rainy day in the city'],
    query: 'talk about rain',
    topN: 2,
  });
  print('Reranking:', result.ranking);
});
//# sourceMappingURL=bedrock-string.js.map
