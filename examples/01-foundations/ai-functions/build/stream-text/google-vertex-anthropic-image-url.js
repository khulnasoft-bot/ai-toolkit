import { streamText } from '@ai-toolkit/ai';
import { vertexAnthropic } from '@ai-toolkit/google-vertex/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = streamText({
    model: vertexAnthropic('claude-3-7-sonnet@20250219'),
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
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
//# sourceMappingURL=google-vertex-anthropic-image-url.js.map
