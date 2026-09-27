import { google } from '@ai-toolkit/google';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: google('gemini-1.5-flash'),
    maxOutputTokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          {
            type: 'image',
            image:
              'https://github.com/khulnasoft/ai-toolkit/blob/main/examples/ai-functions/data/comic-cat.png?raw=true',
          },
        ],
      },
    ],
  });

  console.log(result.text);
});
