import { openai } from '@ai-toolkit/openai';
import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

globalThis.AI_TOOLKIT_DEFAULT_PROVIDER = openai;

run(async () => {
  const result = streamText({
    model: 'gpt-4o',
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
