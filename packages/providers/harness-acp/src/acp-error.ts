import { AITOOLKITError } from '@ai-toolkit/provider';

const name = 'AI_HarnessACPCapabilityUnsupportedError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

/**
 * Thrown when an ACP harness profile requests a capability the
 * underlying ACP implementation does not support (e.g. missing
 * permission-mode mapping, missing output-schema mapping, or no
 * exposed sandbox port).
 */
export class HarnessACPCapabilityUnsupportedError extends AITOOLKITError {
  private readonly [symbol] = true; // used in isInstance

  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super({ name, message, cause });
  }

  static isInstance(
    error: unknown,
  ): error is HarnessACPCapabilityUnsupportedError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}

const configName = 'AI_HarnessACPConfigError';
const configMarker = `vercel.ai.error.${configName}`;
const configSymbol = Symbol.for(configMarker);

/**
 * Thrown for invalid `createACP()` configuration (bad harnessId,
 * source, executable, or mapping).
 */
export class HarnessACPConfigError extends AITOOLKITError {
  private readonly [configSymbol] = true; // used in isInstance

  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super({ name: configName, message, cause });
  }

  static isInstance(error: unknown): error is HarnessACPConfigError {
    return AITOOLKITError.hasMarker(error, configMarker);
  }
}
