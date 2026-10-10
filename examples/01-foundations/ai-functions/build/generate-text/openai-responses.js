import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: openai.responses('gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
    maxOutputTokens: 1000,
    providerOptions: {
      openai: {
        parallelToolCalls: false,
        store: false,
        metadata: {
          key1: 'value1',
          key2: 'value2',
        },
        user: 'user_123',
      },
    },
  });
  console.log(result.text);
  console.log();
  console.log('Finish reason:', result.finishReason);
  console.log('Usage:', result.usage);
  console.log('Request:', JSON.stringify(result.request, null, 2));
  console.log('Response:', JSON.stringify(result.response, null, 2));
});
//# sourceMappingURL=openai-responses.js.map
