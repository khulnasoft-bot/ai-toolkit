import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_LoadAPIKeyError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

export class LoadAPIKeyError extends AITOOLKITError {
  private readonly [symbol] = true; // used in isInstance

  constructor({ message }: { message: string }) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is LoadAPIKeyError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
