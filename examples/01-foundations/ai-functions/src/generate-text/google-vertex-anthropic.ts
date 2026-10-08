import { vertexAnthropic } from '@ai-toolkit/google-vertex/anthropic';
import { generateText } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await generateText({
    // model: vertexAnthropic('claude-3-5-sonnet-v2@20241022'),
    model: vertexAnthropic('claude-3-5-sonnet-v2@20241022'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
});
