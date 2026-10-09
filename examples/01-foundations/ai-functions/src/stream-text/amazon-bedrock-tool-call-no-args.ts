import { streamText, tool } from '@ai-toolkit/ai';
import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { z } from 'zod';
import { printFullStream } from '../lib/print-full-stream';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
    tools: {
      updateIssueList: tool({
        inputSchema: z.object({}),
      }),
    },
    prompt: 'Update the issue list',
  });

  await printFullStream({ result });
});
