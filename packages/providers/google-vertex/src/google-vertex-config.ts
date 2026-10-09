import type { FetchFunction, Resolvable } from '@ai-toolkit/provider-utils';

export interface GoogleVertexConfig {
  provider: string;
  baseURL: string;
  headers: Resolvable<Record<string, string | undefined>>;
  fetch?: FetchFunction;
}
