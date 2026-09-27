import { google } from '@ai-toolkit/google';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Based on this context: https://studio.khulnasoft.com/providers/ai-toolkit-providers/google-generative-ai, tell me how to use Gemini with AI TOOLKIT`,
          },
        ],
      },
    ],
    tools: {
      url_context: google.tools.urlContext({}),
    },
  });

  console.log(result.text);
  console.log();
  console.log('SOURCES');
  console.log(result.sources);
  console.log();
  console.log('PROVIDER METADATA');
  console.log(result.providerMetadata?.google);
});
