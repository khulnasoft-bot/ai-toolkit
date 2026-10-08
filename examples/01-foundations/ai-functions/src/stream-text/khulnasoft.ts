import { khulnasoft } from '@ai-toolkit/khulnasoft';
import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: khulnasoft('v0-1.5-md'),
    prompt: 'Implement Fibonacci in Lua.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
