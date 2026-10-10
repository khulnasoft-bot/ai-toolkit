import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
    const result = await generateText({
        model: openai.chat('gpt-5'),
        prompt: 'Write a poem about a boy and his first pet dog.',
        providerOptions: {
            openai: {
                textVerbosity: 'low',
            },
        },
    });
    console.log('Response:', result.response?.body);
    console.log('Request:', result.request?.body);
});
//# sourceMappingURL=openai-gpt-chat-verbosity.js.map