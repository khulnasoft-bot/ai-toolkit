import { khulnasoft } from '@ai-toolkit/khulnasoft';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: khulnasoft('v0-1.5-md'),
    prompt: 'Implement Fibonacci in Lua.',
  });

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
});
