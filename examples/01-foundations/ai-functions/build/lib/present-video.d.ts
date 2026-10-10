import type { GeneratedFile } from '@ai-toolkit/ai';
/**
 * Saves generated video files to the output directory with unique timestamps.
 * Videos are typically too large to display in the terminal, so we just save them.
 * @param videos - An array of generated videos to process and save.
 */
export declare function presentVideos(videos: GeneratedFile[]): Promise<void>;
