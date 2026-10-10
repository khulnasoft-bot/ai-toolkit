import type { ProviderMetadata } from '../types';
import type { Source } from '../types/language-model';
import type { GeneratedFile } from './generated-file';
import type { ReasoningOutput } from './reasoning-output';
import type { ToolApprovalRequestOutput } from './tool-approval-request-output';
import type { ToolApprovalResponseOutput } from './tool-approval-response-output';
import type { TypedToolCall } from './tool-call';
import type { TypedToolError } from './tool-error';
import type { TypedToolResult } from './tool-result';
import type { ToolSet } from './tool-set';

export type ContentPart<TOOLS extends ToolSet> =
  | { type: 'text'; text: string; providerMetadata?: ProviderMetadata }
  | ReasoningOutput
  | ({ type: 'source' } & Source)
  | { type: 'custom'; kind: `${string}.${string}`; providerMetadata?: ProviderMetadata }
  | {
      type: 'file';
      file: GeneratedFile;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-file';
      file: GeneratedFile;
      providerMetadata?: ProviderMetadata;
    }
  | ({ type: 'tool-call' } & TypedToolCall<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ({ type: 'tool-result' } & TypedToolResult<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ({ type: 'tool-error' } & TypedToolError<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ToolApprovalRequestOutput<TOOLS>
  | ToolApprovalResponseOutput<TOOLS>;
