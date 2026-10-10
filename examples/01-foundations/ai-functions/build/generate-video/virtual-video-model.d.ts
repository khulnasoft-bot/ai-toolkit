import type { Experimental_VideoModelV4 as VideoModelV4 } from '@ai-toolkit/provider';
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
export declare const virtualVideoModel: VideoModelV4;
