import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-4o-mini'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    // consume stream
    for await (const _textPart of result.textStream) {
    }
    console.log('REQUEST BODY');
    console.log((await result.request).body);
});
//# sourceMappingURL=openai-request-body.js.map