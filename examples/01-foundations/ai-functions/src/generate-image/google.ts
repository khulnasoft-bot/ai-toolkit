import { generateImage } from '@ai-toolkit/ai';
import { type GoogleGenerativeAIImageProviderOptions, google } from '@ai-toolkit/google';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';

run(async () => {
  const { image } = await generateImage({
    model: google.image('imagen-4.0-generate-001'),
    prompt: 'A burrito launched through a tunnel',
    aspectRatio: '1:1',
    providerOptions: {
      google: {
        personGeneration: 'dont_allow',
      } satisfies GoogleGenerativeAIImageProviderOptions,
    },
  });

  await presentImages([image]);
});
