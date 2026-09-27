// @ts-nocheck
// This file uses @ai-toolkit/google (NOT vertex) - should NOT be transformed
import { google } from '@ai-toolkit/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-2.5-flash'),
  providerOptions: {
    google: {
      safetySettings: [],
    },
  },
  prompt: 'Hello',
});

// These should stay as 'google' since we're using @ai-toolkit/google
console.log(result.providerMetadata?.google?.safetyRatings);
const { google: metadata } = result.providerMetadata ?? {};
