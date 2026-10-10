import fs from 'node:fs';
import { generateText } from '@ai-toolkit/ai';
import { google } from '@ai-toolkit/google';
import { run } from '../lib/run';
run(async () => {
    const result = await generateText({
        model: google('gemini-1.5-flash'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: 'Describe the image in detail.' },
                    { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
                ],
            },
        ],
    });
    console.log(result.content);
});
//# sourceMappingURL=google-image.js.map