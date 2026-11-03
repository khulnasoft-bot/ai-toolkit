import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: openai('gpt-5'),
    prompt: 'How many "r"s are in the word "strawberry"?',
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'detailed',
      },
    },
  });
  console.log(JSON.stringify(result.request.body, null, 2));
  console.log(JSON.stringify(result.content, null, 2));
});
//# sourceMappingURL=openai-reasoning.js.map
