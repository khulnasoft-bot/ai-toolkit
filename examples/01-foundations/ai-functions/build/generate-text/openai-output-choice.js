import { generateText, Output, stepCountIs } from '@ai-toolkit/ai';
import { openai, } from '@ai-toolkit/openai';
import { print } from '../lib/print';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';
run(async () => {
    const result = await generateText({
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
    print('Output:', result.output);
    print('Request:', result.request.body);
});
//# sourceMappingURL=openai-output-choice.js.map