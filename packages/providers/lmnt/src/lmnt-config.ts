import type { FetchFunction } from '@ai-toolkit/provider-utils';

export type LMNTConfig = {
  provider: string;
  url: (options: { modelId: string; path: string }) => string;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
  generateId?: () => string;
};
