import { generateText } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: 'How many "r"s are in the word "strawberry"?',
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled' },
      },
    },
    maxRetries: 0,
  });
  console.log('Reasoning:');
  console.log(result.reasoning);
  console.log();
  console.log('Text:');
  console.log(result.text);
  console.log();
  console.log('Warnings:', result.warnings);
});
//# sourceMappingURL=anthropic-reasoning-without-budget.js.map
