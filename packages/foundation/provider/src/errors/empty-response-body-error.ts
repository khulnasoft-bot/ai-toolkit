import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_EmptyResponseBodyError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class EmptyResponseBodyError extends AITOOLKITError {
  constructor({ message = 'Empty response body' }: { message?: string } = {}) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is EmptyResponseBodyError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
