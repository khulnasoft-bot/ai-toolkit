import { generateObject } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { z } from 'zod';
import { run } from '../lib/run';
run(async () => {
    const result = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: z.object({
            recipe: z.object({
                name: z.string(),
                ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
                steps: z.array(z.string()),
            }),
        }),
        prompt: 'Generate a lasagna recipe.',
    });
    console.log(JSON.stringify(result, null, 2));
});
//# sourceMappingURL=openai-full-result.js.map