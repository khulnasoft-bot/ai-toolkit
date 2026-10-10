import type {
  LanguageModelV3Content,
  LanguageModelV3Text,
  LanguageModelV4Content,
  LanguageModelV4Text,
} from '@ai-toolkit/provider';

export function extractTextContent(
  content: Array<LanguageModelV3Content | LanguageModelV4Content>,
): string | undefined {
  const parts = content.filter(
    (content): content is LanguageModelV3Text | LanguageModelV4Text =>
      content.type === 'text',
  );

  if (parts.length === 0) {
    return undefined;
  }

  return parts.map(content => content.text).join('');
}
