import { AITOOLKITError } from '@ai-toolkit/provider';

const name = 'AI_MCPClientError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

/**
 * An error occurred with the MCP client.
 */
export class MCPClientError extends AITOOLKITError {
  readonly data?: unknown;
  readonly code?: number;

  constructor({
    name = 'MCPClientError',
    message,
    cause,
    data,
    code,
  }: {
    name?: string;
    message: string;
    cause?: unknown;
    data?: unknown;
    code?: number;
  }) {
    super({ name, message, cause });
    this.data = data;
    this.code = code;
  }

  static isInstance(error: unknown): error is MCPClientError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
