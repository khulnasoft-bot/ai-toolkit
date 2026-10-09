import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_UnsupportedFunctionalityError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class UnsupportedFunctionalityError extends AITOOLKITError {
  readonly functionality: string;

  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`,
  }: {
    functionality: string;
    message?: string;
  }) {
    super({ name, message });
    this.functionality = functionality;
  }

  static isInstance(error: unknown): error is UnsupportedFunctionalityError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
