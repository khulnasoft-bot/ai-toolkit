import { AITOOLKITError } from './ai-toolkit-error';
import { getErrorMessage } from './get-error-message';

const name = 'AI_JSONParseError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class JSONParseError extends AITOOLKITError {
  readonly text: string;

  constructor({ text, cause }: { text: string; cause: unknown }) {
    super({
      name,
      message: `JSON parsing failed: Text: ${text}.\nError message: ${getErrorMessage(cause)}`,
      cause,
    });

    this.text = text;
  }

  static isInstance(error: unknown): error is JSONParseError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
