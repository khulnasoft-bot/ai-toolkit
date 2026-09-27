import { SharedV3Warning } from '@ai-toolkit/provider';

/**
Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.
  */
export type Warning = SharedV3Warning;
