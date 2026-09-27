import { khulnasoft } from '@ai-toolkit/khulnasoft';
import { generateText } from '@ai-toolkit/ai';
import fs from 'node:fs';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
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
  });

  console.log(result.text);
});
