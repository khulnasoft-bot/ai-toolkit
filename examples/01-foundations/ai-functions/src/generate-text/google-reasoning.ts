import { google } from '@ai-toolkit/google';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: google('gemini-2.5-pro'),
    prompt: 'How many "r"s are in the word "strawberry"?',
  });

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
});
