/**
 * A simple terminal spinner for long-running operations.
 * Uses built-in Node.js functionality - no external dependencies needed.
 */
export class Spinner {
  frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  currentFrame = 0;
  interval = null;
  message;
  stream = process.stderr;
  startTime = null;
  constructor(message = 'Loading...') {
    this.message = message;
  }
  start() {
    if (this.interval) return this;
    this.startTime = performance.now();
    // Hide cursor
    this.stream.write('\x1B[?25l');
    this.interval = setInterval(() => {
      const frame = this.frames[this.currentFrame];
      this.stream.write(`\r${frame} ${this.message}${this.formatDuration()}`);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);
    return this;
  }
  stop(finalMessage) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    // Clear the line and show cursor
    this.stream.write('\r\x1B[K');
    this.stream.write('\x1B[?25h');
    if (finalMessage) {
      this.stream.write(`${finalMessage}\n`);
    }
  }
  succeed(message) {
    this.stop(`✔ ${message || this.message}${this.formatDuration()}`);
  }
  fail(message) {
    this.stop(`✖ ${message || this.message}${this.formatDuration()}`);
  }
  formatDuration() {
    if (this.startTime === null) return '';
    const ms = performance.now() - this.startTime;
    if (ms < 1000) return ` (${Math.round(ms)}ms)`;
    const seconds = ms / 1000;
    if (seconds < 60) return ` (${seconds.toFixed(1)}s)`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return ` (${minutes}m ${remainingSeconds.toFixed(1)}s)`;
  }
  update(message) {
    this.message = message;
  }
}
/**
 * Wraps an async operation with a spinner.
 * @param message - The message to display while the operation is running.
 * @param fn - The async function to execute.
 * @returns The result of the async function.
 */
export async function withSpinner(message, fn) {
  const spinner = new Spinner(message);
  spinner.start();
  try {
    const result = await fn();
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}
//# sourceMappingURL=spinner.js.map
