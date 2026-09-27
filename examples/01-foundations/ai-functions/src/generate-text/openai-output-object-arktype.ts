import { openai } from '@ai-toolkit/openai';
import { generateText, Output } from '@ai-toolkit/ai';
import { type } from 'arktype';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({
      schema: type({
        recipe: {
          name: 'string',
          ingredients: type({ name: 'string', amount: 'string' }).array(),
          steps: 'string[]',
        },
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  });

  print('Output:', result.output);
  print('Request:', result.request.body);
});
