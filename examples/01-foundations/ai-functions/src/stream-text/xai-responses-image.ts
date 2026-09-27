import { xai } from '@ai-toolkit/xai';
import { streamText } from '@ai-toolkit/ai';
import fs from 'node:fs';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: xai.responses('grok-2-vision-1212'),
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

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
