import { openai } from '@ai-toolkit/openai';
import { generateText, wrapLanguageModel } from '@ai-toolkit/ai';
import { yourLogMiddleware } from './your-log-middleware';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourLogMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });
});
