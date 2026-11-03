import { generateText } from '@ai-toolkit/ai';
import { vertex } from '@ai-toolkit/google-vertex';
import { run } from '../lib/run';
run(async () => {
  const { text, sources, providerMetadata } = await generateText({
    model: vertex('gemini-2.5-flash'),
    tools: {
      enterprise_web_search: vertex.tools.enterpriseWebSearch({}),
    },
    prompt: 'What are the latest FDA regulations for clinical trials?',
  });
  const groundingMetadata = providerMetadata?.vertex?.groundingMetadata;
  console.log('Generated Text:', text);
  console.log();
  console.log('SOURCES');
  console.dir({ sources }, { depth: null });
  console.log();
  console.log('PROVIDER METADATA');
  console.dir(providerMetadata, { depth: null });
  console.log();
  console.log('GROUNDING METADATA');
  console.log('Web Search Queries:', groundingMetadata?.webSearchQueries);
});
//# sourceMappingURL=google-vertex-enterprise-web-search.js.map
