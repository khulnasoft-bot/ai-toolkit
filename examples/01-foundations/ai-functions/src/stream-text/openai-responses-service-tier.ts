import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: openai('gpt-5-nano'),
    prompt: 'What color is the sky in one word?',
    providerOptions: {
      openai: {
        serviceTier: 'flex',
      },
    },
  });

  await result.consumeStream();
  const providerMetadata = await result.providerMetadata;

  console.log('Provider metadata:', providerMetadata);
  // Provider metadata: {
  //   openai: {
  //     responseId: '...',
  //     serviceTier: 'flex'
  //   }
  // }
});
