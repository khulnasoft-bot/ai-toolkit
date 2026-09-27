import { openai } from '@ai-toolkit/openai';
import { generateText, stepCountIs } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    model: openai.responses('gpt-5-codex'),
    tools: {
      local_shell: openai.tools.localShell({
        execute: async ({ action }) => {
          console.log('ACTION');
          console.dir(action, { depth: Infinity });

          const stdout = `
❯ ls
README.md     build         data          node_modules  package.json  src           tsconfig.json
          `;

          return { output: stdout };
        },
      }),
    },
    prompt: 'List the files in my home directory.',
    stopWhen: stepCountIs(2),
    onStepFinish: step => {
      console.dir(step.content, { depth: Infinity });
    },
  });
});
