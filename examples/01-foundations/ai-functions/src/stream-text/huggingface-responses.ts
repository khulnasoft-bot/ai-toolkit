import { huggingface } from '@ai-toolkit/huggingface';
import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: huggingface.responses('moonshotai/Kimi-K2-Instruct'),
    prompt: 'Tell me a three sentence bedtime story about a unicorn.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
});
