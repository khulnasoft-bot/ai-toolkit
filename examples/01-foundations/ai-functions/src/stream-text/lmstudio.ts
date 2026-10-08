import { createOpenAICompatible } from '@ai-toolkit/openai-compatible';
import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
});

run(async () => {
  const result = streamText({
    model: lmstudio('bartowski/gemma-2-9b-it-GGUF'),
    prompt: 'Invent a new holiday and describe its traditions.',
    maxRetries: 1,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
