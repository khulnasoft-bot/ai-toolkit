import { generateText, tool } from '@ai-toolkit/ai';
import { google } from '@ai-toolkit/google';
import { z } from 'zod';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';
run(async () => {
  const result = await generateText({
    model: google('gemini-1.5-pro-latest'),
    maxOutputTokens: 512,
    tools: {
      weather: weatherTool,
      cityAttractions: tool({
        inputSchema: z.object({ city: z.string() }),
      }),
    },
    toolChoice: {
      type: 'tool',
      toolName: 'weather',
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });
  console.log(JSON.stringify(result, null, 2));
});
//# sourceMappingURL=google-tool-choice.js.map
