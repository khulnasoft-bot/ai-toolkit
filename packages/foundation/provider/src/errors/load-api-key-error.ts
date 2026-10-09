import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_LoadAPIKeyError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class LoadAPIKeyError extends AITOOLKITError {
  constructor({ message }: { message: string }) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is LoadAPIKeyError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
