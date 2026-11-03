import fs from 'node:fs';
import { generateText } from '@ai-toolkit/ai';
import { vertexAnthropic } from '@ai-toolkit/google-vertex/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: vertexAnthropic('claude-3-5-sonnet-v2@20241022'),
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
//# sourceMappingURL=google-vertex-anthropic-image.js.map
