import { generateText, tool } from '@ai-toolkit/ai';
import { vertexAnthropic } from '@ai-toolkit/google-vertex/anthropic';
import { z } from 'zod';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';
run(async () => {
  const result = await generateText({
    model: vertexAnthropic('claude-3-5-sonnet-v2@20241022'),
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
//# sourceMappingURL=google-vertex-anthropic-tool-choice.js.map
