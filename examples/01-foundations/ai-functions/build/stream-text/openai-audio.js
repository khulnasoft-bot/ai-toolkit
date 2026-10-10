import fs from 'node:fs';
import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: openai('gpt-4o-audio-preview'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: 'What is the audio saying?' },
                    {
                        type: 'file',
                        mediaType: 'audio/mpeg',
                        data: fs.readFileSync('./data/galileo.mp3'),
                    },
                ],
            },
        ],
    });
    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }
    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
});
//# sourceMappingURL=openai-audio.js.map