import { generateText } from '@ai-toolkit/ai';
import { mistral } from '@ai-toolkit/mistral';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: mistral('open-mistral-7b'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  console.log(JSON.stringify(result, null, 2));
});
//# sourceMappingURL=mistral-full-result.js.map
