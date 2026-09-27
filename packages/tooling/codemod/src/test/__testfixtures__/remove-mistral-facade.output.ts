// @ts-nocheck
import { createMistral } from '@ai-toolkit/mistral';

const mistral = createMistral({
  apiKey: 'key',
  baseURL: 'url',
  headers: { custom: 'header' },
});
