import type { GeneratedAudioFile } from '@ai-toolkit/ai';
/**
 * Saves a generated audio file to the output directory with unique timestamps.
 * @param audio - The generated audio file to save.
 */
export declare function saveAudioFile(audio: GeneratedAudioFile): Promise<void>;
