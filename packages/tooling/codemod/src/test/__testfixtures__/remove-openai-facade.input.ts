// @ts-nocheck
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { custom: 'header' },
});
