import { embedMany } from '@ai-toolkit/ai';
import { cohere } from '@ai-toolkit/cohere';
import { run } from '../lib/run';
run(async () => {
  const { embeddings, usage, warnings } = await embedMany({
    model: cohere.embedding('embed-multilingual-v3.0'),
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
//# sourceMappingURL=cohere.js.map
