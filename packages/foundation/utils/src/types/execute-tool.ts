import { isAsyncIterable } from '../is-async-iterable';
import type { Tool, ToolExecuteFunction, ToolExecutionOptions } from './tool';

export async function* executeTool<INPUT = any, OUTPUT = any, CONTEXT = any>({
  tool,
  execute: executeArg,
  input,
  options,
}: {
  tool?: Tool<INPUT, OUTPUT, CONTEXT> & {
    execute: ToolExecuteFunction<INPUT, OUTPUT, CONTEXT>;
  };
  execute?: ToolExecuteFunction<INPUT, OUTPUT, CONTEXT>;
  input: INPUT;
  options: ToolExecutionOptions & { context?: CONTEXT };
}): AsyncGenerator<
  { type: 'preliminary'; output: OUTPUT } | { type: 'final'; output: OUTPUT }
> {
  // Fall back to the legacy `experimental_context` field so callers that
  // have not migrated to `context` yet keep working at runtime.
  const context =
    options.context ??
    (options as { experimental_context?: CONTEXT }).experimental_context;

  const execute = executeArg ?? tool?.execute;

  if (execute == null) {
    throw new Error('executeTool requires a tool with an execute function.');
  }

  // Call `execute` as a method of the tool when a tool object is provided so
  // class-based tools that rely on `this` keep working. Do not destructure
  // `execute` off the tool before calling it.
  const result =
    tool != null && executeArg == null
      ? tool.execute(input, { ...options, context: context as CONTEXT })
      : execute(input, { ...options, context: context as CONTEXT });

  if (isAsyncIterable(result)) {
    let lastOutput: OUTPUT | undefined;
    for await (const output of result) {
      lastOutput = output;
      yield { type: 'preliminary', output };
    }
    yield { type: 'final', output: lastOutput! };
  } else {
    yield { type: 'final', output: await result };
  }
}
