// @ts-nocheck
import { createAnthropic } from '@ai-toolkit/anthropic';
import { createMistral } from '@ai-toolkit/mistral';
import { createOpenAI } from '@ai-toolkit/openai';

const _anthropic = createAnthropic({
  baseURL: 'https://api.anthropic.com',
});

const _openai = createOpenAI({
  baseURL: 'https://api.openai.com',
});

const _mistral = createMistral({
  baseURL: 'https://api.mistral.ai',
});

// Should NOT rename - not in provider creation
const _config = {
  baseUrl: 'https://example.com',
};

// Should NOT rename - not a provider
function _someOtherFunction({ baseUrl }) {
  return baseUrl;
}
