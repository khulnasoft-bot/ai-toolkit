import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-5-codex'),
        prompt: 'Write a JavaScript function that returns the sum of two numbers.',
    });
    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }
    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
});
//# sourceMappingURL=openai-codex.js.map