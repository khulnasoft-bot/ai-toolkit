import { mistral } from '@ai-toolkit/mistral';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: mistral('mistral-small-latest'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is an embedding model according to this document?',
          },
          {
            type: 'file',
            data: new URL(
              'https://github.com/khulnasoft/ai-toolkit/blob/main/examples/ai-functions/data/ai.pdf?raw=true',
            ),
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
  });

  console.log(result.text);
});
