import { generateText, tool } from '@ai-toolkit/ai';
import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { z } from 'zod';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
    tools: {
      updateIssueList: tool({
        inputSchema: z.object({}), // empty input schema
      }),
    },
    prompt: 'Update the issue list',
  });

  print('Content:', result.content);
});
