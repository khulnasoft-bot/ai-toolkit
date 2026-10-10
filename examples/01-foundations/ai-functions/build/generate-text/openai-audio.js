import fs from 'node:fs';
import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: openai('gpt-4o-audio-preview'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What is the audio saying?' },
          {
            type: 'file',
            mediaType: 'audio/mpeg',
            data: fs.readFileSync('./data/galileo.mp3'),
          },
        ],
      },
    ],
  });
  console.log(result.text);
});
//# sourceMappingURL=openai-audio.js.map
