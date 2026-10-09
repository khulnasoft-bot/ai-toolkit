import { ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { print } from '../lib/print';
import { run } from '../lib/run';

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
