import { generateImage } from '@ai-toolkit/ai';
import { fal } from '@ai-toolkit/fal';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const { images } = await generateImage({
        model: fal.image('fal-ai/flux/schnell'),
        prompt: 'A cat wearing an intricate robe while gesticulating wildly, in the style of 80s pop art',
    });
    await presentImages(images);
});
//# sourceMappingURL=fal.js.map