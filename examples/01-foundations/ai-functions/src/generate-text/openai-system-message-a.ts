import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' },
    ],
  });

  console.log(result.text);
});
