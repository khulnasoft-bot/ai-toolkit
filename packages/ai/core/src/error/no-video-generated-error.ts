import { AITOOLKITError } from '@ai-toolkit/provider';
import type { VideoModelResponseMetadata } from '../types/video-model-response-metadata';

const name = 'AI_NoVideoGeneratedError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class NoVideoGeneratedError extends AITOOLKITError {
  readonly responses: Array<VideoModelResponseMetadata>;

  constructor({
    message = 'No video generated.',
    cause,
    responses,
  }: {
    message?: string;
    cause?: unknown;
    responses: Array<VideoModelResponseMetadata>;
  }) {
    super({ name, message, cause });

    this.responses = responses;
  }

  static isInstance(error: unknown): error is NoVideoGeneratedError {
    return AITOOLKITError.hasMarker(error, marker);
  }

  /**
   * @deprecated use `isInstance` instead
   */
  static isNoVideoGeneratedError(
    error: unknown,
  ): error is NoVideoGeneratedError {
    return !!(
      error instanceof Error &&
      error.name === name &&
      typeof (error as NoVideoGeneratedError).responses !== 'undefined'
    );
  }

  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,

      cause: this.cause,
      responses: this.responses,
    };
  }
}
