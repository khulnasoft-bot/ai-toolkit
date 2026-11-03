import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  const { request } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  console.log('REQUEST BODY');
  console.log(request.body);
});
//# sourceMappingURL=openai-request-body.js.map
