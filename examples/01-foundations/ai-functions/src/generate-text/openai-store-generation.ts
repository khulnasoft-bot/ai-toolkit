import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { text, usage } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
    providerOptions: {
      openai: {
        store: true,
        metadata: {
          custom: 'value',
        },
      },
    },
  });

  console.log(text);
  console.log();
  console.log('Usage:', usage);
});
