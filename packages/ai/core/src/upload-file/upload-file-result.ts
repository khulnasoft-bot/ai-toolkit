import type { SharedV4Warning } from '@ai-toolkit/provider';
import type { ProviderMetadata } from '../types/provider-metadata';
import type { ProviderReference } from '../types/provider-reference';

export interface UploadFileResult {
  readonly providerReference: ProviderReference;
  readonly mediaType?: string;
  readonly filename?: string;
  /**
   * The size of the uploaded file in bytes, if reported by the provider.
   */
  readonly byteSize?: number;
  /**
   * When the file was created, if reported by the provider.
   */
  readonly createdAt?: Date;
  /**
   * When the provider will delete the file (retention expiry), if reported.
   */
  readonly expiresAt?: Date;
  readonly providerMetadata?: ProviderMetadata;
  readonly warnings: Array<SharedV4Warning>;
}
