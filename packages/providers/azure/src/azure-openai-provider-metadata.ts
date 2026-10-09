import type {
  ResponsesSourceDocumentProviderMetadata,
  ResponsesTextProviderMetadata,
} from '@ai-toolkit/openai/internal';

export type AzureResponsesTextProviderMetadata = {
  azure: ResponsesTextProviderMetadata;
};

export type AzureResponsesSourceDocumentProviderMetadata = {
  azure: ResponsesSourceDocumentProviderMetadata;
};
