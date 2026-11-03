import fs from 'node:fs';
import { generateObject } from '@ai-toolkit/ai';
import { bedrock } from '@ai-toolkit/amazon-bedrock';
import { z } from 'zod';
import { run } from '../lib/run';
run(async () => {
  const result = await generateObject({
    model: bedrock('us.anthropic.claude-sonnet-4-20250514-v1:0'),
    schema: z.object({
      summary: z.string().describe('Summary of the PDF document'),
      keyPoints: z.array(z.string()).describe('Key points from the PDF'),
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Summarize this PDF and provide key points.',
          },
          {
            type: 'file',
            data: fs.readFileSync('./data/ai.pdf'),
            mediaType: 'application/pdf',
            providerOptions: {
              bedrock: {
                citations: { enabled: true },
              },
            },
          },
        ],
      },
    ],
  });
  console.log('Response:', JSON.stringify(result, null, 2));
});
//# sourceMappingURL=amazon-bedrock-document-citations.js.map
