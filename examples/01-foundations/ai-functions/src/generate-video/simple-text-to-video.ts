import { experimental_generateVideo as generateVideo } from '@ai-toolkit/ai';
import { presentVideos } from '../lib/present-video';
import { run } from '../lib/run';
import { virtualVideoModel } from './virtual-video-model';

run(async () => {
  const { video } = await generateVideo({
    model: virtualVideoModel,
    prompt: 'A cat walking on a treadmill',
    aspectRatio: '16:9',
    resolution: '1280x720',
    duration: 5,
    fps: 24,
  });

  await presentVideos([video]);
});
