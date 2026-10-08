import { huggingface } from '@ai-toolkit/huggingface';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: huggingface.responses('moonshotai/Kimi-K2-Instruct'),
    prompt: 'Tell me a three sentence bedtime story about a unicorn.',
  });

  console.log(result.text);
  console.log(result.usage);
});
