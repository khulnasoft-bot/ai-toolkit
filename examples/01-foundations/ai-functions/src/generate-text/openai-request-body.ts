import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { request } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log('REQUEST BODY');
  console.log(request.body);
});
