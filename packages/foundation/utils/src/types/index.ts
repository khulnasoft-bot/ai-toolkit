export type {
  AssistantContent,
  AssistantModelMessage,
} from './assistant-model-message';
export type {
  FilePart,
  ImagePart,
  ReasoningPart,
  TextPart,
  ToolCallPart,
  ToolResultOutput,
  ToolResultPart,
} from './content-part';
export type { DataContent } from './data-content';
export type { Context } from './context';
export { executeTool } from './execute-tool';
export type { ModelMessage } from './model-message';
export type { ProviderOptions } from './provider-options';
export type { SystemModelMessage } from './system-model-message';
export {
  dynamicTool,
  tool,
  type InferToolInput,
  type InferToolOutput,
  type ProviderDefinedTool,
  type ProviderExecutedTool,
  type Tool,
  type ToolExecutionOptions,
  type ToolExecuteFunction,
  type ToolNeedsApprovalFunction,
} from './tool';
export type { ToolApprovalRequest } from './tool-approval-request';
export type { ToolApprovalResponse } from './tool-approval-response';
export type { ToolCall } from './tool-call';
export type { ToolContent, ToolModelMessage } from './tool-model-message';
export type { ToolResult } from './tool-result';
export type { ToolSet } from './tool-set';
export type { InferToolContext } from './infer-tool-context';
export type { InferToolSetContext } from './infer-tool-set-context';
export { isExecutableTool, type ExecutableTool } from './executable-tool';
export type {
  SandboxSession,
  SandboxSession as Experimental_SandboxSession,
} from './sandbox';
export type { UserContent, UserModelMessage } from './user-model-message';
import type { ToolExecutionOptions } from './tool';

/**
 * @deprecated Use ToolExecutionOptions instead.
 */
export type ToolCallOptions = ToolExecutionOptions;
