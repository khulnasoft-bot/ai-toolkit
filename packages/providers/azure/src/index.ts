export type {
  OpenAIChatLanguageModelOptions,
  OpenAIResponsesProviderOptions,
} from '@ai-toolkit/openai';
export type {
  AzureOpenAIProvider,
  AzureOpenAIProviderSettings,
} from './azure-openai-provider';
export { azure, createAzure } from './azure-openai-provider';
export type {
  AzureResponsesSourceDocumentProviderMetadata,
  AzureResponsesTextProviderMetadata,
} from './azure-openai-provider-metadata';
export { VERSION } from './version';
