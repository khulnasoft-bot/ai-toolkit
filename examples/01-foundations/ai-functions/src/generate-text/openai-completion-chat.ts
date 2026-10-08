import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: openai('gpt-3.5-turbo-instruct'),
    maxOutputTokens: 1024,
    system: 'You are a helpful chatbot.',
    messages: [
      {
        role: 'user',
        content: 'Hello!',
      },
      {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
      },
      {
        role: 'user',
        content: 'I need help with my computer.',
      },
    ],
  });

  console.log(result.text);
});
