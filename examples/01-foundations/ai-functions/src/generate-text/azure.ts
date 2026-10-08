import { azure } from '@ai-toolkit/azure';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { text, usage } = await generateText({
    model: azure('gpt-4.1-mini'), // use your own deployment
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log(text);
  console.log();
  console.log('Usage:', usage);
});
