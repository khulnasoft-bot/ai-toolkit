import { openai } from '@ai-toolkit/openai';
import { ToolLoopAgent } from '@ai-toolkit/ai';
import { run } from '../lib/run';
import { print } from '../lib/print';

const agent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
});

run(async () => {
  const result = await agent.generate({
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  print('CONTENT:', result.content);
});
