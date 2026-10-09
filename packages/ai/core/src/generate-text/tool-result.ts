import type { InferToolInput, InferToolOutput } from '@ai-toolkit/provider-utils';
import type { ValueOf } from '../../src/util/value-of';
import type { ProviderMetadata } from '../types';
import type { ToolSet } from './tool-set';

export type StaticToolResult<TOOLS extends ToolSet> = ValueOf<{
  [NAME in keyof TOOLS]: {
    type: 'tool-result';
    toolCallId: string;
    toolName: NAME & string;
    input: InferToolInput<TOOLS[NAME]>;
    output: InferToolOutput<TOOLS[NAME]>;
    providerExecuted?: boolean;
    providerMetadata?: ProviderMetadata;
    toolMetadata?: Record<string, unknown>;
    dynamic?: false | undefined;
    preliminary?: boolean;
    title?: string;
  };
}>;

export type DynamicToolResult = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  input: unknown;
  output: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: Record<string, unknown>;
  dynamic: true;
  preliminary?: boolean;
  title?: string;
};

export type TypedToolResult<TOOLS extends ToolSet> = StaticToolResult<TOOLS> | DynamicToolResult;
