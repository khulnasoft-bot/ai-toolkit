import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: openai('gpt-4o'),
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
            filename: 'ai.pdf',
          },
        ],
      },
    ],
  });

  console.log(result.text);
});
