import { streamText } from '@ai-toolkit/ai';
import { fireworks } from '@ai-toolkit/fireworks';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: fireworks('accounts/fireworks/models/kimi-k2-instruct'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }
    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
});
//# sourceMappingURL=fireworks-kimi-k2.js.map