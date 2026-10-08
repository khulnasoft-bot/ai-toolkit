/**
 * Symbol used for identifying AI TOOLKIT Error instances.
 * Enables checking if an error is an instance of AITOOLKITError across package versions.
 */
const marker = 'vercel.ai.error';
const symbol = Symbol.for(marker);

/**
 * Custom error class for AI TOOLKIT related errors.
 * @extends Error
 */
export class AITOOLKITError extends Error {
  private readonly [symbol] = true; // used in isInstance

  /**
   * The underlying cause of the error, if any.
   */
  readonly cause?: unknown;

  /**
   * Creates an AI TOOLKIT Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name,
    message,
    cause,
  }: {
    name: string;
    message: string;
    cause?: unknown;
  }) {
    super(message);

    this.name = name;
    this.cause = cause;
  }

  /**
   * Checks if the given error is an AI TOOLKIT Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI TOOLKIT Error, false otherwise.
   */
  static isInstance(error: unknown): error is AITOOLKITError {
    return AITOOLKITError.hasMarker(error, marker);
  }

  protected static hasMarker(error: unknown, marker: string): boolean {
    const markerSymbol = Symbol.for(marker);
    return (
      error != null &&
      typeof error === 'object' &&
      markerSymbol in error &&
      typeof error[markerSymbol] === 'boolean' &&
      error[markerSymbol] === true
    );
  }
}
