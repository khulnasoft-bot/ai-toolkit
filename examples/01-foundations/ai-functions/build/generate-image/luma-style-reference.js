import { generateImage } from '@ai-toolkit/ai';
import { luma } from '@ai-toolkit/luma';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const result = await generateImage({
        model: luma.image('photon-flash-1'),
        prompt: 'A blue cream Persian cat launching its website on Vercel',
        aspectRatio: '1:1',
        providerOptions: {
            luma: {
                referenceType: 'style',
                images: [{ weight: 0.8 }],
            },
        },
    });
    await presentImages(result.images);
});
//# sourceMappingURL=luma-style-reference.js.map