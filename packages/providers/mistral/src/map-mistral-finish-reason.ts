import type { LanguageModelV3FinishReason } from '@ai-toolkit/provider';

export function mapMistralFinishReason(
  finishReason: string | null | undefined,
): LanguageModelV3FinishReason['unified'] {
  switch (finishReason) {
    case 'stop':
      return 'stop';
    case 'length':
    case 'model_length':
      return 'length';
    case 'tool_calls':
      return 'tool-calls';
    default:
      return 'other';
  }
}
