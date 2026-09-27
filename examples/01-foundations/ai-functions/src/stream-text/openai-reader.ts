import { openai } from '@ai-toolkit/openai';
import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    maxOutputTokens: 512,
    temperature: 0.3,
    maxRetries: 5,
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  const reader = result.textStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    process.stdout.write(value);
  }
});
