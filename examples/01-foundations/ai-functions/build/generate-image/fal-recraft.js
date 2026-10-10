import { generateImage } from '@ai-toolkit/ai';
import { fal } from '@ai-toolkit/fal';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const { images } = await generateImage({
        model: fal.image('fal-ai/recraft/v3/text-to-image'),
        prompt: 'A Sumatran rhino meandering through a dense forest among fireflies at dusk',
    });
    await presentImages(images);
});
//# sourceMappingURL=fal-recraft.js.map