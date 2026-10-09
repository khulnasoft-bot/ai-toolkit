import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { z } from 'zod';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';

run(async () => {
  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    tools: {
      weather: weatherTool,
      cityAttractions: {
        inputSchema: z.object({ city: z.string() }),
      },
    },
    onChunk(chunk) {
      console.log('onChunk', chunk);
    },
    prompt: 'What is the weather in San Francisco?',
  });

  // consume stream:
  for await (const _textPart of result.textStream) {
  }
});
