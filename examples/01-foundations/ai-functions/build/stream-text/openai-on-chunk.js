import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-3.5-turbo'),
        onChunk({ chunk }) {
            console.log('onChunk', chunk);
        },
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    // consume stream:
    for await (const _textPart of result.textStream) {
    }
});
//# sourceMappingURL=openai-on-chunk.js.map