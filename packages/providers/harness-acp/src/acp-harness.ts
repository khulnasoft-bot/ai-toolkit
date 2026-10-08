import {
  HarnessACPCapabilityUnsupportedError,
  HarnessACPConfigError,
} from './acp-error';
import type {
  ACPGatewayEnvValue,
  ACPHarnessOptions,
  HarnessPermissionMode,
} from './acp-harness-options';
import { getSourceIdentity } from './acp-source';
import { VERSION } from './version';

export const ACP_PROTOCOL_VERSION = 'v1' as const;
export const DEFAULT_STARTUP_TIMEOUT_MS = 120_000;
export const DEFAULT_SKILLS_DIRECTORY = '.agents/skills';
export const DEFAULT_HOST_TOOL_MCP_TRANSPORT = 'stdio' as const;

const HARNESS_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ACPHarness {
  readonly kind: 'acp';
  readonly harnessId: string;
  readonly version: 'v1';
  readonly options: ACPHarnessOptions;
  /** Client attribution string, e.g. `ai-toolkit/harness-acp/0.0.0`. */
  readonly clientAppId: string;
  /** Stable bootstrap/lifecycle identity for this profile. */
  getBootstrapIdentity(): string;
  /** Resolve the configured permission mode against the profile mapping. */
  resolvePermissionMode(mode: HarnessPermissionMode): unknown;
  /** Resolve gateway `env` placeholders for the given client app id. */
  resolveGatewayEnv(values: {
    apiKey: string;
    baseUrl: string;
    authorization?: string;
  }): Record<string, unknown>;
}

function defaultBridgeToken(): string {
  // Runtime-neutral random 32-byte hex token (crypto.getRandomValues
  // works in Node 18+ and edge runtimes without node: imports).
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function getClientAppId(options: ACPHarnessOptions): string {
  const name = options.clientApp?.name ?? 'ai-toolkit/harness-acp';
  const version = options.clientApp?.version ?? VERSION;
  return `${name}/${version}`;
}

/**
 * Create an ACP harness profile for `HarnessAgent`.
 *
 * The generic adapter owns the bridge, ACP client, host-tool relay,
 * event translation, approvals, and lifecycle behavior; the profile
 * describes how to install and configure one ACP runtime.
 */
export function createACP(options: ACPHarnessOptions): ACPHarness {
  if (!HARNESS_ID_PATTERN.test(options.harnessId)) {
    throw new HarnessACPConfigError({
      message: `Invalid harnessId "${options.harnessId}". Use stable kebab-case (e.g. "acp-codex").`,
    });
  }

  if (options.version != null && options.version !== ACP_PROTOCOL_VERSION) {
    throw new HarnessACPConfigError({
      message: `Unsupported ACP version "${options.version}". Only "v1" is supported.`,
    });
  }

  if (!options.executable || options.executable.includes('/')) {
    throw new HarnessACPConfigError({
      message: `Invalid executable "${options.executable}". Use a bare command name installed by the configured source.`,
    });
  }

  if (!options.modelMapping?.path) {
    throw new HarnessACPConfigError({
      message: `modelMapping with a "path" is required (session-config-option or session-model).`,
    });
  }

  const clientAppId = getClientAppId(options);

  return {
    kind: 'acp',
    harnessId: options.harnessId,
    version: ACP_PROTOCOL_VERSION,
    options: {
      ...options,
      version: ACP_PROTOCOL_VERSION,
      hostToolMcpTransport:
        options.hostToolMcpTransport ?? DEFAULT_HOST_TOOL_MCP_TRANSPORT,
      skillsDirectory: options.skillsDirectory ?? DEFAULT_SKILLS_DIRECTORY,
      startupTimeoutMs: options.startupTimeoutMs ?? DEFAULT_STARTUP_TIMEOUT_MS,
      mintBridgeToken: options.mintBridgeToken ?? defaultBridgeToken,
    },
    clientAppId,

    getBootstrapIdentity() {
      return [
        `harness:${options.harnessId}`,
        `acp:${ACP_PROTOCOL_VERSION}`,
        `src:${getSourceIdentity(options.source)}`,
        `exe:${options.executable}${options.args ? ` ${options.args.join(' ')}` : ''}`,
      ].join('|');
    },

    resolvePermissionMode(mode: HarnessPermissionMode) {
      const mapping = options.permissionModeMapping;
      // No mapping: adapter applies permissionMode by tool kind at runtime.
      if (mapping == null) {
        return { type: 'tool-kind', mode };
      }
      const entry = mapping[mode];
      if (entry == null) {
        throw new HarnessACPCapabilityUnsupportedError({
          message: `Permission mode "${mode}" is not supported by harness "${options.harnessId}".`,
        });
      }
      return entry;
    },

    resolveGatewayEnv({ apiKey, baseUrl, authorization }) {
      const env = options.providerAuthentication?.gateway?.env;
      if (env == null) {
        return {};
      }
      return resolveGatewayEnvValue(env, {
        apiKey,
        baseUrl,
        authorization: authorization ?? `Bearer ${apiKey}`,
        clientApp: clientAppId,
      }) as Record<string, unknown>;
    },
  };
}

function resolveGatewayEnvValue(
  value: ACPGatewayEnvValue,
  ctx: {
    apiKey: string;
    baseUrl: string;
    authorization: string;
    clientApp: string;
  },
): unknown {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => resolveGatewayEnvValue(item, ctx));
  }
  if (typeof value === 'object' && value !== null && '$source' in value) {
    const placeholder = value as { $source: string; ensureSuffix?: string };
    let resolved: string;
    switch (placeholder.$source) {
      case 'gateway-api-key':
        resolved = ctx.apiKey;
        break;
      case 'gateway-base-url':
        resolved = ctx.baseUrl;
        break;
      case 'gateway-authorization':
        resolved = ctx.authorization;
        break;
      case 'client-app':
        resolved = ctx.clientApp;
        break;
      case 'client-app-name':
        resolved = ctx.clientApp.split('/')[0] ?? ctx.clientApp;
        break;
      case 'client-app-version':
        resolved = ctx.clientApp.split('/')[1] ?? '';
        break;
      default:
        throw new HarnessACPConfigError({
          message: `Unknown gateway $source "${placeholder.$source}".`,
        });
    }
    if (
      placeholder.ensureSuffix != null &&
      !resolved.endsWith(placeholder.ensureSuffix)
    ) {
      resolved = `${resolved}${placeholder.ensureSuffix}`;
    }
    return resolved;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value as Record<string, ACPGatewayEnvValue>).map(
        ([key, entry]) => [key, resolveGatewayEnvValue(entry, ctx)],
      ),
    );
  }
  return value;
}
