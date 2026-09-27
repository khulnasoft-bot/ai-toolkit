// @ts-nocheck
import { generateText, streamText } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';
import type { LanguageModel } from 'ai/internal';

export { generateText } from 'ai';

const result = await generateText({ model: 'openai/gpt-5', prompt: 'hi' });
