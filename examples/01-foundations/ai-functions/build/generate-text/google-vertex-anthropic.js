import { generateText } from '@ai-toolkit/ai';
import { vertexAnthropic } from '@ai-toolkit/google-vertex/anthropic';
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
//# sourceMappingURL=google-vertex-anthropic.js.map