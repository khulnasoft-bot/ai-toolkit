import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_NoContentGeneratedError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

/**
Thrown when the AI provider fails to generate any content.
 */
export class NoContentGeneratedError extends AITOOLKITError {
  constructor({ message = 'No content generated.' }: { message?: string } = {}) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is NoContentGeneratedError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
