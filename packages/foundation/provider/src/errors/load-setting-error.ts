import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_LoadSettingError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

export class LoadSettingError extends AITOOLKITError {
  private readonly [symbol] = true; // used in isInstance

  constructor({ message }: { message: string }) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is LoadSettingError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
