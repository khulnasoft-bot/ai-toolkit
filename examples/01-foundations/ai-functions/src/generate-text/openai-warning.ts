import { openai } from '@ai-toolkit/openai';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

globalThis.AI_TOOLKIT_LOG_WARNINGS = false;

globalThis.AI_TOOLKIT_LOG_WARNINGS = ({ warnings, provider, model }) => {
  console.log('WARNINGS:', warnings, provider, model);
};

run(async () => {
  const result = await generateText({
    model: openai('gpt-5-nano'),
    prompt: 'Invent a new holiday and describe its traditions.',
    seed: 123, // causes warning with gpt-5-nano
    maxOutputTokens: 1000,
  });

  console.log(result.text);
});
