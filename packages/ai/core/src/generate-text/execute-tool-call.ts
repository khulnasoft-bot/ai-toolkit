import {
  executeTool,
  InferToolSetContext,
  ModelMessage,
  Experimental_SandboxSession as SandboxSession,
} from '@ai-toolkit/provider-utils';
import type { Arrayable } from '@ai-toolkit/provider-utils';
import { getToolTimeoutMs } from '../prompt/request-options';
import type { TimeoutConfiguration } from '../prompt/request-options';
import { assembleOperationName } from '../telemetry/assemble-operation-name';
import { recordErrorOnSpan, recordSpan } from '../telemetry/record-span';
import { selectTelemetryAttributes } from '../telemetry/select-telemetry-attributes';
import { TelemetrySettings } from '../telemetry/telemetry-settings';
import type { TelemetryDispatcher } from '../telemetry/telemetry';
import { Tracer } from '@opentelemetry/api';
import { mergeAbortSignals } from '../util/merge-abort-signals';
import { notify } from '../util/notify';
import { now } from '../util/now';
import { TypedToolCall } from './tool-call';
import {
  OnToolExecutionEndCallback,
  OnToolExecutionStartCallback,
  ToolExecutionEndEvent,
  ToolExecutionStartEvent,
} from './tool-execution-events';
import { ToolOutput } from './tool-output';
import { ToolSet } from './tool-set';
import { TypedToolResult } from './tool-result';
import { TypedToolError } from './tool-error';
import { validateToolContext } from './validate-tool-context';

export async function executeToolCall<TOOLS extends ToolSet>({
  toolCall,
  tools,
  callId = toolCall.toolCallId,
  messages,
  abortSignal,
  timeout,
  toolsContext = {} as InferToolSetContext<TOOLS>,
  experimental_context,
  experimental_sandbox: sandbox,
  tracer,
  telemetry,
  onToolExecutionStart,
  onToolExecutionEnd,
  onPreliminaryToolResult,
  executeToolInTelemetryContext,
  runInTracingChannelSpan,
}: {
  toolCall: TypedToolCall<TOOLS>;
  tools: TOOLS | undefined;
  callId?: string;
  messages: ModelMessage[];
  abortSignal: AbortSignal | undefined;
  timeout?: TimeoutConfiguration<TOOLS>;
  toolsContext?: InferToolSetContext<TOOLS>;
  experimental_context?: unknown;
  experimental_sandbox?: SandboxSession;
  tracer?: Tracer;
  telemetry?: TelemetrySettings;
  onToolExecutionStart?: Arrayable<OnToolExecutionStartCallback<TOOLS>>;
  onToolExecutionEnd?: Arrayable<OnToolExecutionEndCallback<TOOLS>>;
  onPreliminaryToolResult?: (result: TypedToolResult<TOOLS>) => void;
  executeToolInTelemetryContext?: <T>(
    params: Partial<ToolExecutionStartEvent<TOOLS>> & {
      callId: string;
      toolCallId: string;
      execute: () => PromiseLike<T>;
    },
  ) => Promise<T>;
  runInTracingChannelSpan?: NonNullable<
    TelemetryDispatcher['runInTracingChannelSpan']
  >;
}): Promise<
  { output: ToolOutput<TOOLS>; toolExecutionMs: number } | undefined
> {
  const { toolName, toolCallId, input } = toolCall;
  const tool = tools?.[toolName];

  if (tool?.execute == null) {
    return undefined;
  }

  // Resolve the per-tool context and validate it against the tool's
  // `contextSchema`. Validation failures throw (fail fast) instead of
  // producing a tool-error output.
  const toolContext = await validateToolContext({
    toolName,
    context:
      toolsContext?.[toolName as keyof InferToolSetContext<TOOLS>] ??
      experimental_context,
    contextSchema: tool.contextSchema,
  });

  const run = async (): Promise<{
    output: ToolOutput<TOOLS>;
    toolExecutionMs: number;
  }> => {
    const startEvent = {
      callId,
      messages,
      toolCall,
      toolContext,
    } as ToolExecutionStartEvent<TOOLS>;

    await notify({ event: startEvent, callbacks: onToolExecutionStart });

    // Resolve the abort signal for this execution. A configured tool
    // timeout creates a merged signal; otherwise the caller's signal is
    // passed through as-is.
    const toolTimeoutMs = getToolTimeoutMs(timeout, toolName);
    const toolAbortSignal =
      toolTimeoutMs != null
        ? mergeAbortSignals(abortSignal, AbortSignal.timeout(toolTimeoutMs))
        : abortSignal;

    const startTimeMs = now();

    let output: ToolOutput<TOOLS>;
    try {
      const stream = executeTool({
        tool,
        input,
        options: {
          toolCallId,
          messages,
          abortSignal: toolAbortSignal,
          context: toolContext,
          // Legacy global context. New code should use `context`.
          experimental_context,
          experimental_sandbox: sandbox,
        },
      });

      let result: unknown;
      for await (const part of stream) {
        if (part.type === 'preliminary') {
          onPreliminaryToolResult?.({
            ...toolCall,
            type: 'tool-result',
            output: part.output,
            preliminary: true,
          });
        } else {
          result = part.output;
        }
      }

      output = {
        type: 'tool-result',
        toolCallId,
        toolName,
        input,
        output: result,
        dynamic: tool.type === 'dynamic',
        ...(toolCall.providerMetadata != null
          ? { providerMetadata: toolCall.providerMetadata }
          : {}),
        ...(toolCall.toolMetadata != null
          ? { toolMetadata: toolCall.toolMetadata }
          : {}),
      } as TypedToolResult<TOOLS>;
    } catch (error) {
      output = {
        type: 'tool-error',
        toolCallId,
        toolName,
        input,
        error,
        dynamic: tool.type === 'dynamic',
        ...(toolCall.providerMetadata != null
          ? { providerMetadata: toolCall.providerMetadata }
          : {}),
        ...(toolCall.toolMetadata != null
          ? { toolMetadata: toolCall.toolMetadata }
          : {}),
      } as TypedToolError<TOOLS>;
    }

    const toolExecutionMs = now() - startTimeMs;

    await notify({
      event: {
        ...startEvent,
        toolOutput: output,
        toolExecutionMs,
      } as ToolExecutionEndEvent<TOOLS>,
      callbacks: onToolExecutionEnd,
    });

    return { output, toolExecutionMs };
  };

  const invoke = async (): Promise<{
    output: ToolOutput<TOOLS>;
    toolExecutionMs: number;
  }> => {
    if (executeToolInTelemetryContext != null) {
      return executeToolInTelemetryContext({
        callId,
        toolCallId,
        messages,
        toolCall,
        toolContext,
        execute: run,
      });
    }

    if (runInTracingChannelSpan != null) {
      return runInTracingChannelSpan({
        type: 'executeTool',
        event: { callId, toolCallId, toolName },
        execute: run,
      });
    }

    return run();
  };

  if (tracer != null) {
    return recordSpan({
      name: 'ai.toolCall',
      attributes: selectTelemetryAttributes({
        telemetry,
        attributes: {
          ...assembleOperationName({
            operationId: 'ai.toolCall',
            telemetry,
          }),
          'ai.toolCall.name': toolName,
          'ai.toolCall.id': toolCallId,
          'ai.toolCall.args': {
            output: () => JSON.stringify(input),
          },
        },
      }),
      tracer,
      fn: async span => {
        const result = await invoke();

        // Errors are recorded on the span; only successful results record
        // output attributes (matching historical behavior).
        if (result.output.type === 'tool-error') {
          recordErrorOnSpan(span, result.output.error);
        } else {
          try {
            span.setAttributes(
              await selectTelemetryAttributes({
                telemetry,
                attributes: {
                  'ai.toolCall.result': {
                    output: () => JSON.stringify(result.output.output),
                  },
                },
              }),
            );
          } catch (ignored) {
            // JSON stringify might fail if the result is not serializable,
            // in which case we just ignore it. In the future we might want to
            // add an optional serialize method to the tool interface and warn
            // if the result is not serializable.
          }
        }

        return result;
      },
    });
  }

  return invoke();
}
