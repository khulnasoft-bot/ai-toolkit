import type { SharedV3ProviderMetadata } from '@ai-toolkit/provider';
import { z } from 'zod/v4';
import { jsonValueSchema } from './json-value';

/**
Additional provider-specific metadata that is returned from the provider.

This is needed to enable provider-specific functionality that can be
fully encapsulated in the provider.
 */
export type ProviderMetadata = SharedV3ProviderMetadata;

/**
 * Backwards-compatible alias used by batch APIs and UI integrations.
 */
export type GatewayProviderMetadata = {
  readonly asyncJob?: {
    readonly jobId?: string;
    readonly webhookSigningSecret?: string;
  };
  [key: string]: unknown;
};

export const providerMetadataSchema: z.ZodType<ProviderMetadata> = z.record(
  z.string(),
  z.record(z.string(), jsonValueSchema.optional()),
);
