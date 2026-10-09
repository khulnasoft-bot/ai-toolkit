import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_InvalidArgumentError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

/**
 * A function argument is invalid.
 */
export class InvalidArgumentError extends AITOOLKITError {
  readonly argument: string;

  constructor({
    message,
    cause,
    argument,
  }: {
    argument: string;
    message: string;
    cause?: unknown;
  }) {
    super({ name, message, cause });

    this.argument = argument;
  }

  static isInstance(error: unknown): error is InvalidArgumentError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
