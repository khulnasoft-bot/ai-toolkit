import { generateText, wrapLanguageModel } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
import { yourLogMiddleware } from './your-log-middleware';
run(async () => {
  const _result = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourLogMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });
});
//# sourceMappingURL=generate-text-log-middleware-example.js.map
