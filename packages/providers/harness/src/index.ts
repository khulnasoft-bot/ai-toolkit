import { AITOOLKITError } from '@ai-toolkit/provider';

/**
 * Permission modes supported across harnesses.
 * Mirrors `HarnessPermissionMode` in `@ai-toolkit/harness-acp`.
 */
export type HarnessPermissionMode = 'allow-reads' | 'allow-edits' | 'allow-all';

/** Minimal harness identity shared by all harness packages. */
export interface Harness {
  readonly kind: string;
  readonly harnessId: string;
  getBootstrapIdentity(): string;
}

const name = 'AI_HarnessCapabilityUnsupportedError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

/**
 * Thrown when a harness does not support a requested capability
 * (e.g. permission mode, structured output, sandbox feature).
 */
export class HarnessCapabilityUnsupportedError extends AITOOLKITError {
  private readonly [symbol] = true; // used in isInstance

  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super({ name, message, cause });
  }

  static isInstance(
    error: unknown,
  ): error is HarnessCapabilityUnsupportedError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}

export { VERSION } from './version';
