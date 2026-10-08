import { vertex } from '@ai-toolkit/google-vertex';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: vertex('gemini-1.5-flash'),
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
            data: 'https://github.com/khulnasoft/ai-toolkit/blob/main/examples/ai-functions/data/ai.pdf?raw=true',
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
  });

  console.log(result.text);
});
