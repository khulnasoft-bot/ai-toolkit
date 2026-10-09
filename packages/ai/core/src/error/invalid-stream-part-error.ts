import { AITOOLKITError } from '@ai-toolkit/provider';
import type { SingleRequestTextStreamPart } from '../generate-text/run-tools-transformation';

const name = 'AI_InvalidStreamPartError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class InvalidStreamPartError extends AITOOLKITError {
  readonly chunk: SingleRequestTextStreamPart<any>;

  constructor({
    chunk,
    message,
  }: {
    chunk: SingleRequestTextStreamPart<any>;
    message: string;
  }) {
    super({ name, message });

    this.chunk = chunk;
  }

  static isInstance(error: unknown): error is InvalidStreamPartError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
