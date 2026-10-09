import { generateText, stepCountIs } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { anthropicLocalFsMemoryTool } from '../lib/anthropic-local-fs-memory-tool';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: `Please remember these [MEM] facts for future turns.
Acknowledge by saying "stored".
[MEM] Name: Alex Rivera
[MEM] Role: PM at Nova Robotics`,
    tools: {
      memory: anthropicLocalFsMemoryTool({ basePath: './memory' }),
    },
    stopWhen: stepCountIs(10),
  });

  console.dir(result.content, { depth: Infinity });
});
