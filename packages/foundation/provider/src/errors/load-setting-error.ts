import { AITOOLKITError } from './ai-toolkit-error';

const name = 'AI_LoadSettingError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class LoadSettingError extends AITOOLKITError {
  constructor({ message }: { message: string }) {
    super({ name, message });
  }

  static isInstance(error: unknown): error is LoadSettingError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
