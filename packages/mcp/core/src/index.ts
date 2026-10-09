export type {
  JSONRPCError,
  JSONRPCMessage,
  JSONRPCNotification,
  JSONRPCRequest,
  JSONRPCResponse,
} from './tool/json-rpc-message';
/**
 * @deprecated Use `MCPClientConfig` instead. Will be removed in a future version.
 */
/**
 * @deprecated Use `MCPClient` instead. Will be removed in a future version.
 */
export type {
  MCPClient as experimental_MCPClient,
  MCPClientConfig as experimental_MCPClientConfig,
} from './tool/mcp-client';
// Stable exports
/**
 * @deprecated Use `createMCPClient` instead. Will be removed in a future version.
 */
export {
  createMCPClient,
  createMCPClient as experimental_createMCPClient,
  type MCPClient,
  type MCPClientConfig,
} from './tool/mcp-client';
export type { MCPTransport } from './tool/mcp-transport';
export type { OAuthClientProvider } from './tool/oauth';
export { auth, UnauthorizedError } from './tool/oauth';
export type {
  OAuthClientInformation,
  OAuthClientMetadata,
  OAuthTokens,
} from './tool/oauth-types';
/**
 * @deprecated Use `MCPClientCapabilities` instead. Will be removed in a future version.
 */
export type {
  ClientCapabilities as MCPClientCapabilities,
  ClientCapabilities as experimental_MCPClientCapabilities,
  ElicitationRequest,
  ElicitResult,
} from './tool/types';
export { ElicitationRequestSchema, ElicitResultSchema } from './tool/types';
