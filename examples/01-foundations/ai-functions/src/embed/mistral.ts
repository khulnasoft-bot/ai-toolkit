import { mistral } from '@ai-toolkit/mistral';
import { embed } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { embedding, usage, warnings } = await embed({
    model: mistral.embedding('mistral-embed'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
  console.log(usage);
  console.log(warnings);
});
