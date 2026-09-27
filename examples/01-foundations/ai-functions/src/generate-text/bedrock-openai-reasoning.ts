import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: bedrock('openai.gpt-oss-120b-1:0'),
    prompt: 'What is 2 + 2 equal to?',
    providerOptions: {
      bedrock: {
        reasoningConfig: { type: 'enabled', maxReasoningEffort: 'medium' },
      },
    },
  });

  console.log(result.reasoningText);
  console.log(result.text);
});
