import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { embedMany } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { embeddings, usage, warnings } = await embedMany({
    model: bedrock.embedding('amazon.titan-embed-text-v2:0'),
    values: [
      'sunny day at the beach',
      'rainy afternoon in the city',
      'snowy night in the mountains',
    ],
  });

  console.log(embeddings);
  console.log(usage);
  console.log(warnings);
});
