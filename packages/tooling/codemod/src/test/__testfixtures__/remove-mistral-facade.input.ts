// @ts-nocheck
import { createMistral } from '@ai-toolkit/mistral';

const _mistral = createMistral({
  apiKey: 'key',
  baseURL: 'url',
  headers: { custom: 'header' },
});
