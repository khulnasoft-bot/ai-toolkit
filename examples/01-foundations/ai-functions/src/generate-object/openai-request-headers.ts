import { createOpenAI } from '@ai-toolkit/openai';
import { generateObject } from '@ai-toolkit/ai';
import { z } from 'zod';
import { run } from '../lib/run';

run(async () => {
  let headers;
  const openai = createOpenAI({
    fetch: (url, init) => {
      headers = {
        ...init?.headers,
        authorization: 'REDACTED',
      };
      return fetch(url, init);
    },
  });
  const options = {
    model: openai('gpt-4o-mini'),
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  };
  await generateObject(options);

  console.log('REQUEST HEADERS');
  console.log(headers);
});
