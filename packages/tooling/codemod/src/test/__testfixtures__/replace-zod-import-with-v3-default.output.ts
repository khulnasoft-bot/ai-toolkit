// @ts-nocheck

import { z } from 'zod/v3';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

export { schema };
