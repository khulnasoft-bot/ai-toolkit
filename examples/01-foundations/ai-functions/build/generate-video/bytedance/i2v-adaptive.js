import { readFileSync } from 'node:fs';
import { experimental_generateVideo as generateVideo } from '@ai-toolkit/ai';
import { byteDance } from '@ai-toolkit/bytedance';
import { presentVideos } from '../../lib/present-video';
import { run } from '../../lib/run';
import { withSpinner } from '../../lib/spinner';
run(async () => {
  const { video } = await withSpinner(
    'Generating image-to-video with seedance-1-5-pro (adaptive ratio)...',
    () =>
      generateVideo({
        model: byteDance.video('seedance-1-5-pro-251215'),
        prompt: {
          image: readFileSync('data/comic-cat.png'),
          text: 'The cat slowly turns its head and blinks, then yawns lazily',
        },
        // 'adaptive' inherits the output ratio from the input image,
        // which Seedance requires for image-to-video, editing, and
        // extension (a fixed ratio is rejected with HTTP 400).
        aspectRatio: 'adaptive',
        duration: 5,
        providerOptions: {
          bytedance: {
            watermark: false,
          },
        },
      }),
  );
  await presentVideos([video]);
});
//# sourceMappingURL=i2v-adaptive.js.map
