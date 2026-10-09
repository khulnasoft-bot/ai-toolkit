import { createJsonErrorResponseHandler } from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';

export const humeErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number(),
  }),
});

export type HumeErrorData = z.infer<typeof humeErrorDataSchema>;

export const humeFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: humeErrorDataSchema,
  errorToMessage: data => data.error.message,
});
