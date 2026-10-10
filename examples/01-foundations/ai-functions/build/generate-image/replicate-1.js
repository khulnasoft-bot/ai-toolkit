import { generateImage } from '@ai-toolkit/ai';
import { replicate } from '@ai-toolkit/replicate';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const { image } = await generateImage({
        model: replicate.image('black-forest-labs/flux-schnell'),
        prompt: 'The Loch Ness Monster getting a manicure',
    });
    await presentImages([image]);
});
//# sourceMappingURL=replicate-1.js.map