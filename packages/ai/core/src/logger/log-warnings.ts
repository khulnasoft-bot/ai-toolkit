import type { SharedV4Warning } from '@ai-toolkit/provider';
import { Warning } from '../types';

/**
 * A function for logging warnings.
 *
 * You can assign it to the `AI_TOOLKIT_LOG_WARNINGS` global variable to use it as the default warning logger.
 *
 * @example
 * ```ts
 * globalThis.AI_TOOLKIT_LOG_WARNINGS = (options) => {
 *   console.log('WARNINGS:', options.warnings, options.provider, options.model);
 * };
 * ```
 */
export type LogWarningsFunction = (options: {
  /**
   * The warnings returned by the model provider.
   */
  warnings: Array<Warning | SharedV4Warning>;

  /**
   * The provider id used for the call.
   */
  provider: string;

  /**
   * The model id used for the call.
   */
  model: string;
}) => void;

/**
 * Formats a warning object into a human-readable string with clear AI TOOLKIT branding
 */
function formatWarning({
  warning,
  provider,
  model,
}: {
  warning: Warning | SharedV4Warning;
  provider: string;
  model: string;
}): string {
  const prefix = `AI TOOLKIT Warning (${provider} / ${model}):`;

  switch (warning.type) {
    case 'unsupported': {
      let message = `${prefix} The feature "${warning.feature}" is not supported.`;
      if (warning.details) {
        message += ` ${warning.details}`;
      }
      return message;
    }

    case 'compatibility': {
      let message = `${prefix} The feature "${warning.feature}" is used in a compatibility mode.`;
      if (warning.details) {
        message += ` ${warning.details}`;
      }
      return message;
    }

    case 'deprecated': {
      return `${prefix} The setting "${warning.setting}" is deprecated. ${warning.message}`;
    }

    case 'other': {
      return `${prefix} ${warning.message}`;
    }

    default: {
      // Fallback for any unknown warning types
      return `${prefix} ${JSON.stringify(warning, null, 2)}`;
    }
  }
}

export const FIRST_WARNING_INFO_MESSAGE =
  'AI TOOLKIT Warning System: To turn off warning logging, set the AI_TOOLKIT_LOG_WARNINGS global to false.';

let hasLoggedBefore = false;

export const logWarnings: LogWarningsFunction = options => {
  // if the warnings array is empty, do nothing
  if (options.warnings.length === 0) {
    return;
  }

  const logger = globalThis.AI_TOOLKIT_LOG_WARNINGS;

  // if the logger is set to false, do nothing
  if (logger === false) {
    return;
  }

  // use the provided logger if it is a function
  if (typeof logger === 'function') {
    logger(options);
    return;
  }

  // display information note on first call
  if (!hasLoggedBefore) {
    hasLoggedBefore = true;
    console.info(FIRST_WARNING_INFO_MESSAGE);
  }

  // default behavior: log warnings to the console
  for (const warning of options.warnings) {
    console.warn(
      formatWarning({
        warning,
        provider: options.provider,
        model: options.model,
      }),
    );
  }
};

// Reset function for testing purposes
export const resetLogWarningsState = () => {
  hasLoggedBefore = false;
};
