import fs from 'node:fs';
import { generateImage } from '@ai-toolkit/ai';
import { run } from '../lib/run';
import { myImageModels } from './setup-registry';
run(async () => {
    const { image } = await generateImage({
        model: myImageModels.imageModel('flux'),
        prompt: 'The Loch Ness Monster getting a manicure',
    });
    const filename = `image-${Date.now()}.png`;
    fs.writeFileSync(filename, image.uint8Array);
    console.log(`Image saved to ${filename}`);
});
//# sourceMappingURL=generate-image.js.map