import type { ModelMessage } from '@ai-toolkit/provider-utils';

export type LanguageModelRequestMetadata = {
  /**
Request HTTP body that was sent to the provider API.
     */
  body?: unknown;

  /**
Messages that were sent to the model in this request.
     */
  messages?: ModelMessage[];
};
