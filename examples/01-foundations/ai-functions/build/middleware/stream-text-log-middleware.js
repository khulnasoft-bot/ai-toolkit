import { streamText, wrapLanguageModel } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
import { yourLogMiddleware } from './your-log-middleware';
run(async () => {
  const result = streamText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourLogMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });
  for await (const _textPart of result.textStream) {
    // consume the stream
  }
});
//# sourceMappingURL=stream-text-log-middleware.js.map
