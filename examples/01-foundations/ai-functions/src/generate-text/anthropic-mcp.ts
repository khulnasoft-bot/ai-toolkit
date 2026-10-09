import { generateText } from '@ai-toolkit/ai';
import { type AnthropicProviderOptions, anthropic } from '@ai-toolkit/anthropic';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: `Call the echo tool with "hello world". what does it respond with back?`,
    providerOptions: {
      anthropic: {
        mcpServers: [
          {
            type: 'url',
            name: 'echo',
            url: 'https://echo.mcp.inevitable.fyi/mcp',
          },
        ],
      } satisfies AnthropicProviderOptions,
    },
  });

  print('Request body:', result.request.body);
  print('Content:', result.content);
});
