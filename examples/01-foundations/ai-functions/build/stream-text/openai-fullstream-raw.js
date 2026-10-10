import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-4o-mini'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    for await (const part of result.fullStream) {
        console.log(JSON.stringify(part));
    }
});
//# sourceMappingURL=openai-fullstream-raw.js.map