import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  await generateText({
    model: openai('gpt-4o'),
    prompt: 'Invent a new holiday and describe its traditions.',
    onFinish(event) {
      console.dir(event, { depth: Infinity });
    },
  });
});
//# sourceMappingURL=openai-on-finish.js.map
