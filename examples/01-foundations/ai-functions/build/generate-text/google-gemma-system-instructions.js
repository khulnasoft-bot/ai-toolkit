import { generateText } from '@ai-toolkit/ai';
import { google } from '@ai-toolkit/google';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: google('gemma-3-12b-it'),
    system:
      'You are a helpful pirate assistant. Always respond like a friendly pirate, using "Arrr" and pirate terminology.',
    prompt: 'What is the meaning of life?',
  });
  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
});
//# sourceMappingURL=google-gemma-system-instructions.js.map
