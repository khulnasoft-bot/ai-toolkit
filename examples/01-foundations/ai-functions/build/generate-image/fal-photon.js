import { generateImage } from '@ai-toolkit/ai';
import { fal } from '@ai-toolkit/fal';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const { images } = await generateImage({
        model: fal.image('fal-ai/luma-photon'),
        prompt: 'A hyrax atop a stump in a forest among fireflies at dusk',
    });
    await presentImages(images);
});
//# sourceMappingURL=fal-photon.js.map