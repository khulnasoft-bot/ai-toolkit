import { AITOOLKITError, getErrorMessage } from '@ai-toolkit/provider';
import type { InvalidToolInputError } from './invalid-tool-input-error';
import type { NoSuchToolError } from './no-such-tool-error';

const name = 'AI_ToolCallRepairError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class ToolCallRepairError extends AITOOLKITError {
  readonly originalError: NoSuchToolError | InvalidToolInputError;

  constructor({
    cause,
    originalError,
    message = `Error repairing tool call: ${getErrorMessage(cause)}`,
  }: {
    message?: string;
    cause: unknown;
    originalError: NoSuchToolError | InvalidToolInputError;
  }) {
    super({ name, message, cause });
    this.originalError = originalError;
  }

  static isInstance(error: unknown): error is ToolCallRepairError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
