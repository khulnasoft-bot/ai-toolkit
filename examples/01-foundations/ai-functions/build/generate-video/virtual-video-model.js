const mp4Data = Uint8Array.from(
  Buffer.from('AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDE=', 'base64'),
);
/**
 * A minimal, self-contained video model used to demonstrate the video
 * generation API without requiring a provider key.
 *
 * Replace `virtualVideoModel` with a real provider model, e.g.
 * `video()` products such as `videomodel` from a provider package:
 *
 * ```ts
 * import { fal } from '@ai-toolkit/fal';
 *
 * const model = fal.video('luma-dream-machine/ray-2');
 * ```
 */
export const virtualVideoModel = {
  specificationVersion: 'v4',
  provider: 'virtual',
  modelId: 'virtual-video',
  maxVideosPerCall: 1,
  async doGenerate({ n, aspectRatio }) {
    return {
      videos: Array.from({ length: n }, () => ({
        type: 'binary',
        data: mp4Data,
        mediaType: 'video/mp4',
      })),
      warnings: [
        {
          type: 'other',
          message: aspectRatio
            ? `Virtual model: no real video was generated (ratio would be ${aspectRatio}). Connect a provider with video support.`
            : 'Virtual model: no real video was generated. Connect a provider with video support.',
        },
      ],
      response: {
        timestamp: new Date(),
        modelId: 'virtual-video',
        headers: {},
      },
    };
  },
};
//# sourceMappingURL=virtual-video-model.js.map
