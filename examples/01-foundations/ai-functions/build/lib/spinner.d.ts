/**
 * A simple terminal spinner for long-running operations.
 * Uses built-in Node.js functionality - no external dependencies needed.
 */
export declare class Spinner {
    private frames;
    private currentFrame;
    private interval;
    private message;
    private stream;
    private startTime;
    constructor(message?: string);
    start(): this;
    stop(finalMessage?: string): void;
    succeed(message?: string): void;
    fail(message?: string): void;
    private formatDuration;
    update(message: string): void;
}
/**
 * Wraps an async operation with a spinner.
 * @param message - The message to display while the operation is running.
 * @param fn - The async function to execute.
 * @returns The result of the async function.
 */
export declare function withSpinner<T>(message: string, fn: () => Promise<T>): Promise<T>;
