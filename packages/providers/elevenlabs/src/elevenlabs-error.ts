import { createJsonErrorResponseHandler } from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';

export const elevenlabsErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number(),
  }),
});

export type ElevenLabsErrorData = z.infer<typeof elevenlabsErrorDataSchema>;

export const elevenlabsFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: elevenlabsErrorDataSchema,
  errorToMessage: data => data.error.message,
});
