// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-toolkit/google';

const _google = createGoogleGenerativeAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { custom: 'header' },
});
