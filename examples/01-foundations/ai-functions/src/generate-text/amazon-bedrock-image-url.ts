import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: bedrock('anthropic.claude-3-haiku-20240307-v1:0'),
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
