import { AITOOLKITError } from '@ai-toolkit/provider';

const name = 'AI_SerializationError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

export class SerializationError extends AITOOLKITError {
  private readonly [symbol] = true; // used in isInstance

  constructor({
    message = 'Failed to serialize value.',
    cause,
  }: {
    message?: string;
    cause?: unknown;
  } = {}) {
    super({ name, message, cause });
  }

  static isInstance(error: unknown): error is SerializationError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
