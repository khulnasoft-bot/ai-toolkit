import { generateText, tool } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { z } from 'zod';
const myToolSet = {
  firstTool: tool({
    description: 'Greets the user',
    inputSchema: z.object({ name: z.string() }),
    execute: async ({ name }) => `Hello, ${name}!`,
  }),
  secondTool: tool({
    description: 'Tells the user their age',
    inputSchema: z.object({ age: z.number() }),
    execute: async ({ age }) => `You are ${age} years old!`,
  }),
};
async function generateSomething(prompt) {
  return generateText({
    model: openai('gpt-4o'),
    tools: myToolSet,
    prompt,
  });
}
const { text, staticToolCalls, staticToolResults } =
  await generateSomething('...');
//# sourceMappingURL=tool-set.js.map
