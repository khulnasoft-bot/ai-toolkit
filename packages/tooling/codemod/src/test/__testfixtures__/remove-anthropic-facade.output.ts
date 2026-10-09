// @ts-nocheck
import { createAnthropic } from '@ai-toolkit/anthropic';

const _anthropic = createAnthropic({
  apiKey: 'key',
  baseURL: 'url',
  headers: { custom: 'header' },
});
