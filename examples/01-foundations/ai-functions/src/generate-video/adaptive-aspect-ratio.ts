import { experimental_generateVideo as generateVideo } from '@ai-toolkit/ai';
import { presentVideos } from '../lib/present-video';
import { run } from '../lib/run';
import { virtualVideoModel } from './virtual-video-model';

run(async () => {
  const { videos } = await generateVideo({
    model: virtualVideoModel,
    prompt: {
      image: 'https://example.com/my-image.png',
      text: 'Animate this image with gentle motion',
    },
    // 'adaptive' lets the provider inherit the ratio from the input image.
    // Required for image-to-video, video editing, and video extension models
    // that reject an explicit aspect ratio.
    aspectRatio: 'adaptive',
    duration: 5,
  });

  await presentVideos(videos);
});
