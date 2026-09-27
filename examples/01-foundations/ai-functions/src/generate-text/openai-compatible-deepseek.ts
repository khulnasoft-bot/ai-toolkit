import { createOpenAICompatible } from '@ai-toolkit/openai-compatible';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

const deepSeek = createOpenAICompatible({
  name: 'deepseek',
  baseURL: 'https://api.deepseek.com',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY ?? ''}`,
  },
});

run(async () => {
  const { text, usage } = await generateText({
    model: deepSeek('deepseek-chat'),
    prompt: 'Write a "Hello, World!" program in TypeScript.',
  });

  console.log(text);
  console.log();
  console.log('Usage:', usage);
});
