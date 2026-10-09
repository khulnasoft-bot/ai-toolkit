import { AITOOLKITError } from '@ai-toolkit/provider';

const name = 'AI_NoOutputGeneratedError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

/**
Thrown when no LLM output was generated, e.g. because of errors.
 */
export class NoOutputGeneratedError extends AITOOLKITError {
  constructor({
    message = 'No output generated.',
    cause,
  }: {
    message?: string;
    cause?: Error;
  } = {}) {
    super({ name, message, cause });
  }

  static isInstance(error: unknown): error is NoOutputGeneratedError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
