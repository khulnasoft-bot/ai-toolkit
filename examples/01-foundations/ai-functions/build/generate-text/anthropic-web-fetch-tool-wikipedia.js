import { generateText } from '@ai-toolkit/ai';
import { anthropic } from '@ai-toolkit/anthropic';
import { run } from '../lib/run';
run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-0'),
    prompt:
      'What is this page about? https://en.wikipedia.org/wiki/Maglemosian_culture',
    tools: {
      web_fetch: anthropic.tools.webFetch_20250910(),
    },
  });
  console.dir(result.response.body, { depth: Infinity });
  console.dir(result.content, { depth: Infinity });
});
//# sourceMappingURL=anthropic-web-fetch-tool-wikipedia.js.map
