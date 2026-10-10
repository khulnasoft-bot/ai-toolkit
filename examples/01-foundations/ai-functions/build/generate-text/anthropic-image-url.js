import { generateText } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { run } from '../lib/run';
run(async () => {
    const result = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: 'Describe the image in detail.' },
                    {
                        type: 'image',
                        image: 'https://github.com/khulnasoft/ai-toolkit/blob/main/examples/ai-functions/data/comic-cat.png?raw=true',
                    },
                ],
            },
        ],
    });
    console.log(result.text);
});
//# sourceMappingURL=anthropic-image-url.js.map