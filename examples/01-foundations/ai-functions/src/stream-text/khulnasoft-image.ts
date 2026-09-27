import { khulnasoft } from '@ai-toolkit/khulnasoft';
import { streamText } from '@ai-toolkit/ai';
import fs from 'node:fs';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: khulnasoft('v0-1.0-md'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
        ],
      },
    ],
    onError: error => {
      console.error(error);
    },
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
