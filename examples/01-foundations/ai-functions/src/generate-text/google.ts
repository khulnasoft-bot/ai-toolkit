import { google } from '@ai-toolkit/google';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: google('gemini-3-flash-preview'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  const googleMetadata = result.providerMetadata?.google;

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
  console.log('Safety info:', {
    promptFeedback: googleMetadata?.promptFeedback,
    safetyRatings: googleMetadata?.safetyRatings,
  });
});
