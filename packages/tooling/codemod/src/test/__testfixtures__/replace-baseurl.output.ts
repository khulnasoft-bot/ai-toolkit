// @ts-nocheck
import { createAnthropic } from '@ai-toolkit/anthropic';
import { createOpenAI } from '@ai-toolkit/openai';
import { createMistral } from '@ai-toolkit/mistral';

const anthropic = createAnthropic({
  baseURL: 'https://api.anthropic.com',
});

const openai = createOpenAI({
  baseURL: 'https://api.openai.com',
});

const mistral = createMistral({
  baseURL: 'https://api.mistral.ai',
});

// Should NOT rename - not in provider creation
const config = {
  baseUrl: 'https://example.com',
};

// Should NOT rename - not a provider
function someOtherFunction({ baseUrl }) {
  return baseUrl;
}
