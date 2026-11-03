import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { print } from '../lib/print';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';
run(async () => {
  const result = streamText({
    model: openai('gpt-5-nano'),
    prompt: 'Invent a new holiday and describe its traditions.',
    maxRetries: 0,
  });
  printFullStream({ result });
  print('Usage:', await result.usage);
  print('Finish reason:', await result.finishReason);
  print('Raw finish reason:', await result.rawFinishReason);
});
//# sourceMappingURL=openai.js.map
