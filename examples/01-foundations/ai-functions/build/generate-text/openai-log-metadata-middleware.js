import { generateText, wrapLanguageModel } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
const logProviderMetadataMiddleware = {
  specificationVersion: 'v3',
  transformParams: async ({ params }) => {
    console.log(
      `providerOptions: ${JSON.stringify(params.providerOptions, null, 2)}`,
    );
    return params;
  },
};
run(async () => {
  const { text } = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: logProviderMetadataMiddleware,
    }),
    providerOptions: {
      myMiddleware: {
        example: 'value',
      },
    },
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  console.log(text);
});
//# sourceMappingURL=openai-log-metadata-middleware.js.map
