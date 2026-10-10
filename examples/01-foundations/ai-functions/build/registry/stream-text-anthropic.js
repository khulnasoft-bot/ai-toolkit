import { streamText } from '@ai-toolkit/ai';
import { run } from '../lib/run';
import { registry } from './setup-registry';
run(async () => {
    const result = streamText({
        model: registry.languageModel('anthropic:haiku'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }
});
//# sourceMappingURL=stream-text-anthropic.js.map