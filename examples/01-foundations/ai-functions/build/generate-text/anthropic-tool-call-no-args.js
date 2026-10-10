import { generateText, tool } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { z } from 'zod';
import { print } from '../lib/print';
import { run } from '../lib/run';
run(async () => {
    const result = await generateText({
        model: anthropic('claude-sonnet-4-5'),
        tools: {
            updateIssueList: tool({
                inputSchema: z.object({}), // empty input schema
            }),
        },
        prompt: 'Update the issue list',
    });
    print('Content:', result.content);
});
//# sourceMappingURL=anthropic-tool-call-no-args.js.map