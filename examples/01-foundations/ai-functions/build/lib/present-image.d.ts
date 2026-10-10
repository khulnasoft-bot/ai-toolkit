import type { Experimental_GeneratedImage as GeneratedImage } from '@ai-toolkit/ai';
/**
 * Displays images in the terminal using a downsampled preview and saves the
 * original, full-resolution files to the output directory with unique
 * timestamps.
 * @param images - An array of generated images to process and display.
 */
export declare function presentImages(images: GeneratedImage[]): Promise<void>;
