import { streamText, } from '@ai-toolkit/ai';
import { khulnasoft } from '@ai-toolkit/khulnasoft';
import { run } from '../lib/run';
import { weatherTool } from '../tools/weather-tool';
const _messages = [];
run(async () => {
    const _toolResponseAvailable = false;
    const result = streamText({
        model: khulnasoft('v0-1.0-md'),
        tools: {
            weather: weatherTool,
        },
        toolChoice: 'required',
        prompt: 'What is the weather in San Francisco and what attractions should I visit?',
    });
    const _fullResponse = '';
    const _toolCalls = [];
    const _toolResponses = [];
    for await (const chunk of result.fullStream) {
        switch (chunk.type) {
            case 'text-delta': {
                process.stdout.write(chunk.text);
                break;
            }
            case 'tool-call': {
                console.log(`TOOL CALL ${chunk.toolName} ${JSON.stringify(chunk.input)}`);
                break;
            }
            case 'tool-result': {
                console.log(`TOOL RESULT ${chunk.toolName} ${JSON.stringify(chunk.output)}`);
                break;
            }
            case 'finish-step': {
                console.log();
                console.log();
                console.log('STEP FINISH');
                console.log('Finish reason:', chunk.finishReason);
                console.log('Usage:', chunk.usage);
                console.log();
                break;
            }
            case 'finish': {
                console.log('FINISH');
                console.log('Finish reason:', chunk.finishReason);
                console.log('Total Usage:', chunk.totalUsage);
                break;
            }
            case 'error':
                console.error('Error:', chunk.error);
                break;
        }
    }
});
//# sourceMappingURL=khulnasoft-tool-call.js.map