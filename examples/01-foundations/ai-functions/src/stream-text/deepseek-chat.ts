import { deepseek } from '@ai-toolkit/deepseek';
import { streamText } from '@ai-toolkit/ai';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: deepseek('deepseek-chat'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  printFullStream({ result });
});
