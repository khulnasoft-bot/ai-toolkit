import { generateText } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-0'),
    prompt:
      'What does this pdf say about AI?\n' +
      'https://raw.githubusercontent.com/khulnasoft/ai-toolkit/main/examples/ai-functions/data/ai.pdf',
    tools: {
      web_fetch: anthropic.tools.webFetch_20250910(),
    },
  });
  console.dir(result.response.body, { depth: Infinity });
  console.dir(result.content, { depth: Infinity });
});
//# sourceMappingURL=anthropic-web-fetch-tool-pdf.js.map
