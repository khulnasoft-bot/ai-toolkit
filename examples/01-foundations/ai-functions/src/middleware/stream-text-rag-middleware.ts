import { openai } from '@ai-toolkit/openai';
import { streamText, wrapLanguageModel } from '@ai-toolkit/ai';
import { yourRagMiddleware } from './your-rag-middleware';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourRagMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
