import { groq } from '@ai-toolkit/groq';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: groq('qwen-qwq-32b'),
    providerOptions: {
      groq: { reasoningFormat: 'parsed' },
    },
    prompt: 'How many "r"s are in the word "strawberry"?',
  });

  console.log('Reasoning:');
  console.log(result.reasoningText);
  console.log();

  console.log('Text:');
  console.log(result.text);
  console.log();

  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
});
