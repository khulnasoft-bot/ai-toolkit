import { streamText } from '@ai-toolkit/ai';
import { deepseek } from '@ai-toolkit/deepseek';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: deepseek('deepseek-reasoner'),
        prompt: 'How many "r"s are in the word "strawberry"?',
    });
    printFullStream({ result });
});
//# sourceMappingURL=deepseek-reasoner.js.map