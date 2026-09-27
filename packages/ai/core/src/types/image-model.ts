import {
  ImageModelV2,
  ImageModelV3,
  ImageModelV3ProviderMetadata,
  ImageModelV2ProviderMetadata,
} from '@ai-toolkit/provider';

/**
Image model that is used by the AI TOOLKIT.
  */
export type ImageModel = string | ImageModelV3 | ImageModelV2;

/**
Metadata from the model provider for this call
  */
// TODO should this be v3 only?
export type ImageModelProviderMetadata =
  | ImageModelV3ProviderMetadata
  | ImageModelV2ProviderMetadata;
