import type {
  LanguageModelV3Content,
  LanguageModelV3Reasoning,
  LanguageModelV4Content,
  LanguageModelV4Reasoning,
} from '@ai-toolkit/provider';

export function extractReasoningContent(
  content: Array<LanguageModelV3Content | LanguageModelV4Content>,
): string | undefined {
  const parts = content.filter(
    (content): content is LanguageModelV3Reasoning | LanguageModelV4Reasoning =>
      content.type === 'reasoning',
  );

  return parts.length === 0
    ? undefined
    : parts.map(content => content.text).join('\n');
}
