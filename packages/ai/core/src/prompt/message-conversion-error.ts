import { AITOOLKITError } from '@ai-toolkit/provider';
import type { UIMessage } from '../ui/ui-messages';

const name = 'AI_MessageConversionError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class MessageConversionError extends AITOOLKITError {
  readonly originalMessage: Omit<UIMessage, 'id'>;

  constructor({
    originalMessage,
    message,
  }: {
    originalMessage: Omit<UIMessage, 'id'>;
    message: string;
  }) {
    super({ name, message });

    this.originalMessage = originalMessage;
  }

  static isInstance(error: unknown): error is MessageConversionError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
