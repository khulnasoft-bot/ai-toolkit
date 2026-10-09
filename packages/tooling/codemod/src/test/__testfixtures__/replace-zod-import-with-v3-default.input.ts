// @ts-nocheck

import z from 'zod';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

export { schema };
