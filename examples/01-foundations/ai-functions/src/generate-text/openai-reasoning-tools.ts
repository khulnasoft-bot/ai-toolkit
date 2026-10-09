import { generateText, tool } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { z } from 'zod';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';

run(async () => {
  const { text, reasoning, toolCalls, usage } = await generateText({
    model: openai('gpt-5'),
    tools: {
      weather: weatherTool,
      calculator: tool({
        description: 'Calculate mathematical expressions',
        inputSchema: z.object({
          expression: z.string().describe('The mathematical expression to calculate'),
        }),
        execute: async ({ expression }) => {
          try {
            // biome-ignore lint/security/noGlobalEval: example calculator intentionally evaluates a math expression
            const result = eval(expression);
            return { expression, result };
          } catch (_error) {
            return { expression, error: 'Invalid expression' };
          }
        },
      }),
    },
    prompt: 'What is the weather in San Francisco? Then calculate how many days are in 3 weeks.',
    maxOutputTokens: 1000,
  });

  console.log('Text:', text);
  console.log('\nReasoning:', reasoning);
  console.log('\nTool Calls:', toolCalls);
  console.log('\nUsage:', usage);
});
