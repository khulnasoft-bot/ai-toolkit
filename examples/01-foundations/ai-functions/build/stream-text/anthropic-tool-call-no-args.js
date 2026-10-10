import { streamText, tool } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { z } from 'zod';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';
run(async () => {
    const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        tools: {
            updateIssueList: tool({
                inputSchema: z.object({}), // empty input schema
            }),
        },
        prompt: 'Update the issue list',
    });
    await printFullStream({ result });
});
//# sourceMappingURL=anthropic-tool-call-no-args.js.map