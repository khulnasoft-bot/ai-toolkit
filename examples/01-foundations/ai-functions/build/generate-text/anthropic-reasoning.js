import { generateText } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    prompt: 'How many "r"s are in the word "strawberry"?',
    temperature: 0.5, // should get ignored (warning)
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 12000 },
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
//# sourceMappingURL=anthropic-reasoning.js.map
