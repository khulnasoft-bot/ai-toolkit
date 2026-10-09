import { createJsonErrorResponseHandler } from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';

export const gladiaErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number(),
  }),
});

export type GladiaErrorData = z.infer<typeof gladiaErrorDataSchema>;

export const gladiaFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: gladiaErrorDataSchema,
  errorToMessage: data => data.error.message,
});
