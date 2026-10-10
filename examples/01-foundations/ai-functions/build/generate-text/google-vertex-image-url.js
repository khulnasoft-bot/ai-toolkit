import { generateText } from '@ai-toolkit/ai';
import { vertex } from '@ai-toolkit/google-vertex';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: vertex('gemini-1.5-flash'),
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
//# sourceMappingURL=google-vertex-image-url.js.map
