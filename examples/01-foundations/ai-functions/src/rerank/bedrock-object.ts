import { rerank } from '@ai-toolkit/ai';
import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { print } from '../lib/print';
import { run } from '../lib/run';
import { documents } from './documents';

run(async () => {
  const result = await rerank({
    model: bedrock.reranking('cohere.rerank-v3-5:0'),
    documents,
    query: 'Which pricing did we get from Oracle?',
    topN: 2,
  });

  print('Reranking:', result.ranking);
});
