import {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64,
} from '@ai-toolkit/provider-utils';
import type { ProviderMetadata } from '../types';

/**
 * A generated file.
 */
export interface GeneratedFile {
  /**
File as a base64 encoded string.
     */
  readonly base64: string;

  /**
File as a Uint8Array.
     */
  readonly uint8Array: Uint8Array;

  /**
The IANA media type of the file.

@see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  readonly mediaType: string;

  /**
Provider-specific metadata for the file payload.
   */
  readonly providerMetadata?: ProviderMetadata;
}

export class DefaultGeneratedFile implements GeneratedFile {
  private base64Data: string | undefined;
  private uint8ArrayData: Uint8Array | undefined;

  readonly mediaType: string;
  readonly providerMetadata?: ProviderMetadata;

  constructor({
    data,
    mediaType,
    providerMetadata,
  }: {
    data: unknown;
    mediaType: string;
    providerMetadata?: ProviderMetadata;
  }) {
    const record = typeof data === 'object' && data != null ? data : undefined;
    const normalizedData =
      record != null && 'type' in record
        ? record.type === 'data'
          ? (record as Record<string, unknown>).data
          : record.type === 'text'
            ? new TextEncoder().encode(String((record as Record<string, unknown>).text ?? ''))
            : record.type === 'url'
              ? String((record as Record<string, unknown>).url ?? '')
              : undefined
        : data;

    const resolvedData =
      normalizedData instanceof Uint8Array
        ? normalizedData
        : normalizedData instanceof URL
          ? normalizedData.toString()
          : normalizedData;

    const isUint8Array = resolvedData instanceof Uint8Array;
    this.base64Data = isUint8Array ? undefined : String(resolvedData ?? '');
    this.uint8ArrayData = isUint8Array ? resolvedData : undefined;
    this.mediaType = mediaType;
    this.providerMetadata = providerMetadata;
  }

  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get base64() {
    if (this.base64Data == null) {
      this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData!);
    }
    return this.base64Data;
  }

  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    if (this.uint8ArrayData == null) {
      this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data!);
    }
    return this.uint8ArrayData;
  }
}

export class DefaultGeneratedFileWithType extends DefaultGeneratedFile {
  readonly type = 'file';
}
