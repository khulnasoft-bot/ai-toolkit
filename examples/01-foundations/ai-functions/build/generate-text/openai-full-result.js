import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    console.log(JSON.stringify(result, null, 2));
});
//# sourceMappingURL=openai-full-result.js.map