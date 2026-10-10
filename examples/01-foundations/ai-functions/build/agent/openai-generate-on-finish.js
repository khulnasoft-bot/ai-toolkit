import { ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
const agent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
  onFinish({ text }) {
    console.log(text);
  },
});
run(async () => {
  await agent.generate({
    prompt: 'Invent a new holiday and describe its traditions.',
  });
});
//# sourceMappingURL=openai-generate-on-finish.js.map
