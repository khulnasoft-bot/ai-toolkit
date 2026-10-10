import { Output, stepCountIs, streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';
run(async () => {
  const result = streamText({
    model: openai('gpt-4o-mini'),
    providerOptions: {
      openai: {
        strictJsonSchema: true,
      },
    },
    tools: {
      weather: weatherTool,
    },
    stopWhen: stepCountIs(5),
    output: Output.choice({
      options: [
        'winter jacket',
        'shorts and tshirt',
        'light jacket',
        'raincoat',
      ],
    }),
    prompt: 'Get the weather for San Francisco. What should I wear?',
  });
  for await (const partialOutput of result.partialOutputStream) {
    console.clear();
    console.log(partialOutput);
  }
});
//# sourceMappingURL=openai-output-choice.js.map
