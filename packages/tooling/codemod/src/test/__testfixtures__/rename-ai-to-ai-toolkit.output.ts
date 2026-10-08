// @ts-nocheck
import { generateText, streamText } from 'ai-toolkit';
import { MockLanguageModelV2 } from 'ai-toolkit/test';
import type { LanguageModel } from 'ai-toolkit/internal';

export { generateText } from 'ai-toolkit';

const result = await generateText({ model: 'openai/gpt-5', prompt: 'hi' });
