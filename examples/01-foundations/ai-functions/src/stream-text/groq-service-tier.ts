import { streamText } from '@ai-toolkit/ai';
import { type GroqProviderOptions, groq } from '@ai-toolkit/groq';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: groq('gemma2-9b-it'),
    prompt: 'Invent a new holiday and describe its traditions.',
    providerOptions: {
      groq: {
        serviceTier: 'flex',
      } satisfies GroqProviderOptions,
    },
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
