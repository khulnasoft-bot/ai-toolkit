// re-exports:
export {
  createGateway,
  type GatewayModelId,
  gateway,
} from '@ai-toolkit/gateway';
export {
  asSchema,
  createIdGenerator,
  dynamicTool,
  type FlexibleSchema,
  generateId,
  type IdGenerator,
  type InferSchema,
  type InferToolInput,
  type InferToolOutput,
  jsonSchema,
  parseJsonEventStream,
  type Schema,
  type Tool,
  type ToolApprovalRequest,
  type ToolApprovalResponse,
  type ToolCallOptions,
  type ToolExecuteFunction,
  type ToolExecutionOptions,
  tool,
  zodSchema,
} from '@ai-toolkit/provider-utils';

// directory exports
export * from './agent';
export * from './embed';
export * from './error';
export * from './generate-image';
export * from './generate-object';
export * from './generate-speech';
export * from './generate-text';
export * from './generate-video';
export * from './logger';
export * from './middleware';
export * from './prompt';
export * from './registry';
export * from './rerank';
// telemetry types:
export type { TelemetrySettings } from './telemetry/telemetry-settings';
export * from './text-stream';
export * from './transcribe';
export * from './types';
export * from './ui';
export * from './ui-message-stream';
export * from './upload-file';
export * from './upload-skill';
export * from './util';

// import globals
import './global';
