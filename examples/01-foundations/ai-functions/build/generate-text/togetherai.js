import { generateText } from '@ai-toolkit/ai';
import { togetherai } from '@ai-toolkit/togetherai';
import { run } from '../lib/run';
run(async () => {
  const { text, usage } = await generateText({
    model: togetherai('meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  console.log(text);
  console.log();
  console.log('Usage:', usage);
});
//# sourceMappingURL=togetherai.js.map
