import type { ACPSource } from './acp-source';

export type ACPVersion = 'v1';

/** Downstream provider authentication mode. */
export type ACPAuthMode = 'auto' | 'direct' | 'ai-gateway';

/**
 * Request transformation returned by `credentialBrokering`.
 * The sandbox sees the masked `match` value; the real credential
 * from the host `env` is injected after the request leaves the sandbox.
 */
export interface ACPCredentialRequestTransformation {
  match: {
    host?: string;
    url?: string;
    headers?: Record<string, string>;
  };
  transform: {
    headers?: Record<string, string>;
  };
}

export interface ACPCredentialBrokeringContext {
  /** Effective host runtime environment (real credentials). */
  env: Record<string, string | undefined>;
  /** Environment forwarded to the sandbox (masked placeholders). */
  sandboxEnv?: Record<string, string | undefined>;
}

export type ACPCredentialBrokering = (
  context: ACPCredentialBrokeringContext,
) => ACPCredentialRequestTransformation[];

export type ACPCredentialForwarding = (
  value: string,
  name: string,
) => string | Promise<string>;

/** Gateway `$source` placeholder names resolved after gateway selection. */
export type ACPGatewaySource =
  | 'gateway-api-key'
  | 'gateway-base-url'
  | 'gateway-authorization'
  | 'client-app'
  | 'client-app-name'
  | 'client-app-version';

export interface ACPGatewayPlaceholder {
  $source: ACPGatewaySource;
  ensureSuffix?: string;
}

export type ACPGatewayEnvValue =
  | string
  | number
  | boolean
  | null
  | ACPGatewayPlaceholder
  | { [key: string]: ACPGatewayEnvValue }
  | ACPGatewayEnvValue[];

export type ACPModelMapping =
  | { type: 'session-config-option'; path: string }
  | { type: 'session-model'; path: string };

export type ACPInstructionMapping =
  | { type: 'session-meta'; path: string[] }
  | { type: 'launch-env-json'; variable: string; path: (string | number)[] }
  | { type: 'filesystem'; path: string };

export interface ACPOutputSchemaMapping {
  type: 'session-prompt-meta';
  path: string[];
}

export type ACPSessionModeMapping =
  | { type: 'session-mode'; modeId: string }
  | { type: 'session-config'; path: string; value: unknown };

export interface ACPPermissionModeMapping {
  'allow-reads': ACPSessionModeMapping | null;
  'allow-edits': ACPSessionModeMapping | null;
  'allow-all': ACPSessionModeMapping | null;
}

export type HarnessPermissionMode = 'allow-reads' | 'allow-edits' | 'allow-all';

export interface ACPClientApp {
  name: string;
  version: string;
}

export interface ACPHarnessOptions {
  /** Stable kebab-case identity for this profile. */
  harnessId: string;
  /** ACP protocol version. Currently only `'v1'`. */
  version?: ACPVersion;
  /** How to acquire the ACP implementation. */
  source: ACPSource;
  /** Bare command name to launch from the acquired implementation. */
  executable: string;
  /** Optional arguments passed to the executable. */
  args?: string[];
  /** Non-credential host env names forwarded into the sandbox. */
  forwardEnv?: string[];
  /** Host credential env names (use with `credentialBrokering`). */
  credentialEnv?: string[];
  /** Maps real host credentials to sandbox-masked request transforms. */
  credentialBrokering?: ACPCredentialBrokering;
  /** Customizes each credential value immediately before sandbox forwarding. */
  credentialForwarding?: ACPCredentialForwarding;
  /** Persistent environment values written at bootstrap. */
  env?: Record<string, string>;
  /** Native tool definitions for static typing / exact name matching. */
  builtinTools?: Record<string, unknown>;
  /** MCP server definitions keyed by server name. */
  mcpServers?: Record<string, unknown>;
  /** Transport for the harness-owned MCP server. Defaults to `'stdio'`. */
  hostToolMcpTransport?: 'stdio' | 'http';
  /** Advertised ACP authentication method / metadata / client capabilities. */
  authentication?: {
    methodId?: string;
    [key: string]: unknown;
  };
  clientCapabilities?: Record<string, unknown>;
  /**
   * Downstream provider auth mode, or a record replacing the host
   * environment for authentication discovery.
   */
  auth?: ACPAuthMode | Record<string, string | undefined>;
  /** Declarative runtime-specific gateway environment. */
  providerAuthentication?: {
    gateway?: { env?: Record<string, ACPGatewayEnvValue> };
  };
  /** Required static mapping from `HarnessAgent` model to ACP operation. */
  modelMapping: ACPModelMapping;
  /** Native skills dir relative to implementation `$HOME`. Default `.agents/skills`. */
  skillsDirectory?: string;
  /** Mapping from `HarnessAgent` instructions to native prompt. */
  instructionMapping?: ACPInstructionMapping;
  /** Opt-in structured-output mapping to `session/prompt._meta`. */
  outputSchemaMapping?: ACPOutputSchemaMapping;
  /** Translation for implementation-specific ask-user-question requests. */
  askUserQuestions?: Record<string, unknown>;
  /** Mappings from harness permission modes to ACP session modes/config. */
  permissionModeMapping?: ACPPermissionModeMapping;
  /** Serializable implementation-specific session metadata. */
  sessionMeta?: Record<string, unknown>;
  /** Exposed bridge port override (defaults to first exposed port). */
  port?: number;
  /** Bridge startup timeout in ms. Default 120_000. */
  startupTimeoutMs?: number;
  /** Returns the bridge auth token for a sandbox id. */
  mintBridgeToken?: (sandboxId: string) => string;
  /** Client attribution. Defaults to `ai-toolkit/harness-acp/<version>`. */
  clientApp?: ACPClientApp;
}
