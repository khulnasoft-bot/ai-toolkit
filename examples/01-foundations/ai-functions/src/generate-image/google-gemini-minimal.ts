import { google } from '@ai-toolkit/google';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const { files } = await generateText({
    model: google('gemini-2.5-flash-image-preview'),
    prompt: 'A nano banana in a fancy restaurant',
  });

  console.log(`Generated ${files.length} image files`);
});
