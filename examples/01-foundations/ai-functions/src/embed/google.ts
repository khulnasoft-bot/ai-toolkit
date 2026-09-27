import { google } from '@ai-toolkit/google';
import { embed } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { embedding, usage, warnings } = await embed({
    model: google.embeddingModel('gemini-embedding-001'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
  console.log(usage);
  console.log(warnings);
});
