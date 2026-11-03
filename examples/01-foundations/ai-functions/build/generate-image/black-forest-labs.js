import { generateImage } from '@ai-toolkit/ai';
import { blackForestLabs } from '@ai-toolkit/black-forest-labs';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
  const { images, providerMetadata } = await generateImage({
    model: blackForestLabs.image('flux-pro-1.1'),
    prompt:
      'A cat wearing an intricate robe while gesticulating wildly, in the style of 80s pop art',
    aspectRatio: '1:1',
    providerOptions: {
      blackForestLabs: {
        outputFormat: 'png',
      },
    },
  });
  await presentImages(images);
  console.log('providerMetadata', JSON.stringify(providerMetadata, null, 2));
});
//# sourceMappingURL=black-forest-labs.js.map
