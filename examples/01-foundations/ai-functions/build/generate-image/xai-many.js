import { generateImage } from '@ai-toolkit/ai';
import { xai } from '@ai-toolkit/xai';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const { images } = await generateImage({
        model: xai.image('grok-2-image'),
        n: 3,
        prompt: 'A chicken flying into the sunset in the style of anime.',
    });
    await presentImages(images);
});
//# sourceMappingURL=xai-many.js.map