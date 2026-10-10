import { streamText } from '@ai-toolkit/ai';
import { groq } from '@ai-toolkit/groq';
import { run } from '../lib/run';
run(async () => {
  const result = streamText({
    model: groq('moonshotai/kimi-k2-instruct-0905'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
//# sourceMappingURL=groq-kimi-k2.js.map
