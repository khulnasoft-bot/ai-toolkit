import { streamText } from '@ai-toolkit/ai';
import { anthropic, } from '@ai-toolkit/anthropic';
import { print } from '../lib/print';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        tools: {
            code_execution: anthropic.tools.codeExecution_20250825(),
        },
        prompt: 'Create a presentation about renewable energy sources with 4 slides. ' +
            'Include: 1) Title slide, 2) Solar power, 3) Wind energy, 4) Conclusion.',
        providerOptions: {
            anthropic: {
                container: {
                    skills: [{ type: 'anthropic', skillId: 'pptx' }],
                },
            },
        },
    });
    await printFullStream({ result });
    const anthropicContainer = (await result.providerMetadata)
        ?.anthropic?.container;
    print('container', anthropicContainer);
});
//# sourceMappingURL=anthropic-skills.js.map