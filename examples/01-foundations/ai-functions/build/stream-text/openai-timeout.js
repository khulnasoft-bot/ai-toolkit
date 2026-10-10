import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { print } from '../lib/print';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-3.5-turbo'),
        prompt: 'Invent a new holiday and describe its traditions.',
        timeout: 1000, // 1 second timeout
    });
    printFullStream({ result });
    print('Usage:', await result.usage);
    print('Finish reason:', await result.finishReason);
});
//# sourceMappingURL=openai-timeout.js.map