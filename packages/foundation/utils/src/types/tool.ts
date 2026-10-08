import { JSONValue } from '@ai-toolkit/provider';
import { FlexibleSchema } from '../schema';
import { ToolResultOutput } from './content-part';
import { ModelMessage } from './model-message';
import { ProviderOptions } from './provider-options';
import type {
  ToolExecuteFunction as ToolExecuteFunctionType,
  ToolExecutionOptions as ToolExecutionOptionsType,
} from './tool-execute-function';

export type {
  ToolExecuteFunction,
  ToolExecutionOptions,
} from './tool-execute-function';

/**
 * Function that is called to determine if the tool needs approval before it can be executed.
 */
export type ToolNeedsApprovalFunction<INPUT> = (
  input: INPUT,
  options: {
    /**
     * The ID of the tool call. You can use it e.g. when sending tool-call related information with stream data.
     */
    toolCallId: string;

    /**
     * Messages that were sent to the language model to initiate the response that contained the tool call.
     * The messages **do not** include the system prompt nor the assistant response that contained the tool call.
     */
    messages: ModelMessage[];

    /**
     * Additional context.
     *
     * Experimental (can break in patch releases).
     */
    experimental_context?: unknown;
  },
) => boolean | PromiseLike<boolean>;

// 0 extends 1 & N checks for any
// [N] extends [never] checks for never
type NeverOptional<N, T> = 0 extends 1 & N
  ? Partial<T>
  : [N] extends [never]
    ? Partial<Record<keyof T, undefined>>
    : T;

type ToolOutputProperties<INPUT, OUTPUT, CONTEXT> = NeverOptional<
  OUTPUT,
  | {
      /**
An async function that is called with the arguments from the tool call and produces a result.
If not provided, the tool will not be executed automatically.

@args is the input of the tool call.
@options.abortSignal is a signal that can be used to abort the tool call.
    */
      execute: ToolExecuteFunctionType<INPUT, OUTPUT, CONTEXT>;

      outputSchema?: FlexibleSchema<OUTPUT>;
    }
  | {
      outputSchema: FlexibleSchema<OUTPUT>;

      execute?: never;
    }
>;

/**
A tool contains the description and the schema of the input that the tool expects.
This enables the language model to generate the input.

The tool can also contain an optional execute function for the actual execution function of the tool.
 */
export type Tool<
  INPUT extends JSONValue | unknown | never = any,
  OUTPUT extends JSONValue | unknown | never = any,
  CONTEXT = any,
> = {
  /**
An optional description of what the tool does.
Will be used by the language model to decide whether to use the tool.
Not used for provider-defined tools.
   */
  description?: string;

  /**
   * An optional title of the tool.
   */
  title?: string;

  /**
Additional provider-specific metadata. They are passed through
to the provider from the AI TOOLKIT and enable provider-specific
functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;

  /**
   * The schema of the input that the tool expects.
   * The language model will use this to generate the input.
   * It is also used to validate the output of the language model.
   *
   * You can use descriptions on the schema properties to make the input understandable for the language model.
   */
  inputSchema: FlexibleSchema<INPUT>;

  /**
   * An optional list of input examples that show the language
   * model what the input should look like.
   */
  inputExamples?: Array<{ input: NoInfer<INPUT> }>;

  /**
   * An optional schema for per-tool context. When defined, the caller must
   * provide a matching entry in `toolsContext`, which is validated before
   * being passed to `execute` as `options.context`.
   */
  contextSchema?: FlexibleSchema<CONTEXT>;

  /**
   * Whether the tool needs approval before it can be executed.
   */
  needsApproval?:
    | boolean
    | ToolNeedsApprovalFunction<[INPUT] extends [never] ? unknown : INPUT>;

  /**
   * Strict mode setting for the tool.
   *
   * Providers that support strict mode will use this setting to determine
   * how the input should be generated. Strict mode will always produce
   * valid inputs, but it might limit what input schemas are supported.
   */
  strict?: boolean;

  /**
   * Optional function that is called when the argument streaming starts.
   * Only called when the tool is used in a streaming context.
   */
  onInputStart?: (
    options: ToolExecutionOptionsType,
  ) => void | PromiseLike<void>;

  /**
   * Optional function that is called when an argument streaming delta is available.
   * Only called when the tool is used in a streaming context.
   */
  onInputDelta?: (
    options: { inputTextDelta: string } & ToolExecutionOptionsType,
  ) => void | PromiseLike<void>;

  /**
   * Optional function that is called when a tool call can be started,
   * even if the execute function is not provided.
   */
  onInputAvailable?: (
    options: {
      input: [INPUT] extends [never] ? unknown : INPUT;
    } & ToolExecutionOptionsType,
  ) => void | PromiseLike<void>;
} & ToolOutputProperties<INPUT, OUTPUT, CONTEXT> & {
    /**
     * Optional conversion function that maps the tool result to an output that can be used by the language model.
     *
     * If not provided, the tool result will be sent as a JSON object.
     */
    toModelOutput?: (options: {
      /**
       * The ID of the tool call. You can use it e.g. when sending tool-call related information with stream data.
       */
      toolCallId: string;

      /**
       * The input of the tool call.
       */
      input: [INPUT] extends [never] ? unknown : INPUT;

      /**
       * The output of the tool call.
       */
      output: 0 extends 1 & OUTPUT
        ? any
        : [OUTPUT] extends [never]
          ? any
          : NoInfer<OUTPUT>;
    }) => ToolResultOutput | PromiseLike<ToolResultOutput>;
  } & (
    | {
        /**
Tool with user-defined input and output schemas.
     */
        type?: undefined | 'function';
      }
    | {
        /**
Tool that is defined at runtime (e.g. an MCP tool).
The types of input and output are not known at development time.
       */
        type: 'dynamic';
      }
    | {
        /**
Tool with provider-defined input and output schemas.
     */
        type: 'provider';

        /**
The ID of the tool. Must follow the format `<provider-name>.<unique-tool-name>`.
   */
        id: `${string}.${string}`;

        /**
The arguments for configuring the tool. Must match the expected arguments defined by the provider for this tool.
     */
        args: Record<string, unknown>;

        /**
         * Whether this provider-executed tool supports deferred results.
         *
         * When true, the tool result may not be returned in the same turn as the
         * tool call (e.g., when using programmatic tool calling where a server tool
         * triggers a client-executed tool, and the server tool's result is deferred
         * until the client tool is resolved).
         *
         * This flag allows the AI TOOLKIT to handle tool results that arrive without
         * a matching tool call in the current response.
         *
         * @default false
         */
        supportsDeferredResults?: boolean;

        /**
         * Whether the tool is executed by the provider (`true`) or by the
         * client (`false`). Client-executed provider-defined tools still
         * carry provider-defined schemas and args.
         */
        isProviderExecuted?: boolean;
      }
  );

/**
 * A tool with provider-defined input and output schemas.
 */
export type ProviderDefinedTool<
  INPUT = any,
  OUTPUT = any,
  CONTEXT = unknown,
> = Tool<INPUT, OUTPUT, CONTEXT> & {
  type: 'provider';
  id: `${string}.${string}`;
  args: Record<string, unknown>;
};

/**
 * A tool that is executed by the provider.
 */
export type ProviderExecutedTool<
  INPUT = any,
  OUTPUT = any,
  CONTEXT = unknown,
> = ProviderDefinedTool<INPUT, OUTPUT, CONTEXT> & {
  isProviderExecuted: true;
};

/**
 * Infer the input type of a tool.
 */
export type InferToolInput<TOOL extends Tool> =
  TOOL extends Tool<infer INPUT, any> ? INPUT : never;

/**
 * Infer the output type of a tool.
 */
export type InferToolOutput<TOOL extends Tool> =
  TOOL extends Tool<any, infer OUTPUT> ? OUTPUT : never;

/**
Helper function for inferring the execute args of a tool.
 */
// Note: overload order is important for auto-completion.
// The first overload infers input, output, and context for tools with a
// `contextSchema`. Its parameter is a flat structural type (rather than
// `Tool` itself): `Tool` makes the required-ness of `execute` depend on
// the inferred `OUTPUT` via a conditional type, which creates an
// inference circularity (the `execute` body is checked before `OUTPUT`
// is fixed, failing the overload), and mapped-type wrappers like `Omit`
// break contextual typing of the `execute` lambda. Prop types are
// referenced from `Tool` via indexed access so they cannot drift.
// Inference collects input from `inputSchema`, output from
// `execute`/`outputSchema`, and context from `contextSchema`; the return
// type is the precise `Tool`.
export function tool<INPUT, OUTPUT = never, CONTEXT = never>(tool: {
  description?: Tool<INPUT, OUTPUT, CONTEXT>['description'];
  title?: Tool<INPUT, OUTPUT, CONTEXT>['title'];
  providerOptions?: Tool<INPUT, OUTPUT, CONTEXT>['providerOptions'];
  inputSchema: FlexibleSchema<INPUT>;
  inputExamples?: Tool<INPUT, OUTPUT, CONTEXT>['inputExamples'];
  contextSchema: FlexibleSchema<CONTEXT>;
  needsApproval?: Tool<INPUT, OUTPUT, CONTEXT>['needsApproval'];
  strict?: Tool<INPUT, OUTPUT, CONTEXT>['strict'];
  onInputStart?: Tool<INPUT, OUTPUT, CONTEXT>['onInputStart'];
  onInputDelta?: Tool<INPUT, OUTPUT, CONTEXT>['onInputDelta'];
  onInputAvailable?: Tool<INPUT, OUTPUT, CONTEXT>['onInputAvailable'];
  toModelOutput?: Tool<INPUT, OUTPUT, CONTEXT>['toModelOutput'];
  type?: undefined | 'function';
  execute?: ToolExecuteFunctionType<INPUT, OUTPUT, CONTEXT>;
  outputSchema?: FlexibleSchema<OUTPUT>;
}): Tool<INPUT, OUTPUT, CONTEXT>;
export function tool<INPUT, OUTPUT>(
  tool: Tool<INPUT, OUTPUT>,
): Tool<INPUT, OUTPUT>;
export function tool<INPUT>(tool: Tool<INPUT, never>): Tool<INPUT, never>;
export function tool<OUTPUT>(tool: Tool<never, OUTPUT>): Tool<never, OUTPUT>;
export function tool(tool: Tool<never, never>): Tool<never, never>;
export function tool(tool: any): any {
  return tool;
}

/**
 * Defines a dynamic tool.
 */
export function dynamicTool(tool: {
  description?: string;
  title?: string;
  providerOptions?: ProviderOptions;
  inputSchema: FlexibleSchema<unknown>;
  execute: ToolExecuteFunctionType<unknown, unknown>;

  /**
   * Optional conversion function that maps the tool result to an output that can be used by the language model.
   *
   * If not provided, the tool result will be sent as a JSON object.
   */
  toModelOutput?: (options: {
    /**
     * The ID of the tool call. You can use it e.g. when sending tool-call related information with stream data.
     */
    toolCallId: string;

    /**
     * The input of the tool call.
     */
    input: unknown;

    /**
     * The output of the tool call.
     */
    output: unknown;
  }) => ToolResultOutput | PromiseLike<ToolResultOutput>;

  /**
   * Whether the tool needs approval before it can be executed.
   */
  needsApproval?: boolean | ToolNeedsApprovalFunction<unknown>;
}): Tool<unknown, unknown> & {
  type: 'dynamic';
} {
  return { ...tool, type: 'dynamic' };
}
