import { createJsonErrorResponseHandler } from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';

export const revaiErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number(),
  }),
});

export type RevaiErrorData = z.infer<typeof revaiErrorDataSchema>;

export const revaiFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: revaiErrorDataSchema,
  errorToMessage: data => data.error.message,
});
