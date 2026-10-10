import { generateImage } from '@ai-toolkit/ai';
import { vertex, } from '@ai-toolkit/google-vertex';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
run(async () => {
    const result = await generateImage({
        model: vertex.image('imagen-4.0-generate-001'),
        prompt: 'A burrito launched through a tunnel',
        aspectRatio: '1:1',
        providerOptions: {
            vertex: {
                addWatermark: false,
            },
        },
    });
    await presentImages(result.images);
    console.log('Provider metadata:', JSON.stringify(result.providerMetadata, null, 2));
});
//# sourceMappingURL=google-vertex.js.map