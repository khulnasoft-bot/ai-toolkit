// @ts-nocheck

import { generateText } from 'ai';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const _result = await generateText({
  model: openai('gpt-4'),
  prompt: 'Generate a person',
  schema,
});

// Mixed import with z and other zod types
import { type ZodSchema, z as zodValidator } from 'zod';

const _mixedSchema: ZodSchema = zodValidator.string();
