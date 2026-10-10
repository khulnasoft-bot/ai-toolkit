import type { Context, InferToolSetContext, ReasoningPart } from '@ai-toolkit/provider-utils';
import type {
  CallWarning,
  FinishReason,
  LanguageModelRequestMetadata,
  LanguageModelResponseMetadata,
  ProviderMetadata,
} from '../types';
import type { Source } from '../types/language-model';
import type { LanguageModelUsage } from '../types/usage';
import type { ContentPart } from './content-part';
import type { GeneratedFile } from './generated-file';
import type { ResponseMessage } from './response-message';
import type {
  DynamicToolCall,
  StaticToolCall,
  TypedToolCall,
} from './tool-call';
import type {
  DynamicToolResult,
  StaticToolResult,
  TypedToolResult,
} from './tool-result';
import type { ToolSet } from './tool-set';

export type OutputChunkTimingStats = {
  min: number;
  p10: number;
  median: number;
  avg: number;
  p90: number;
  max: number;
};

export type StepPerformance = {
  responseTimeMs: number;
  effectiveOutputTokensPerSecond: number;
  outputTokensPerSecond: number | undefined;
  inputTokensPerSecond: number | undefined;
  effectiveTotalTokensPerSecond: number;
  timeToFirstOutputMs: number | undefined;
  timeBetweenOutputChunksMs?: OutputChunkTimingStats;
  stepTimeMs?: number;
  toolExecutionMs?: Record<string, number>;
};

/**
 * The result of a single step in the generation process.
 */
export type StepResult<TOOLS extends ToolSet, RUNTIME_CONTEXT extends Context = Context> = {
  readonly callId: string;
  readonly stepNumber: number;
  readonly provider: string;
  readonly modelId: string;
  readonly model: {
    readonly provider: string;
    readonly modelId: string;
  };
  readonly runtimeContext: RUNTIME_CONTEXT;
  readonly toolsContext: InferToolSetContext<TOOLS>;
  readonly performance: StepPerformance;

  /**
The content that was generated in the last step.
   */
  readonly content: Array<ContentPart<TOOLS>>;

  /**
The generated text.
*/
  readonly text: string;

  /**
The reasoning that was generated during the generation.
*/
  readonly reasoning: Array<ReasoningPart>;

  /**
The reasoning text that was generated during the generation.
*/
  readonly reasoningText: string | undefined;

  /**
The files that were generated during the generation.
*/
  readonly files: Array<GeneratedFile>;

  /**
The sources that were used to generate the text.
*/
  readonly sources: Array<Source>;

  /**
The tool calls that were made during the generation.
*/
  readonly toolCalls: Array<TypedToolCall<TOOLS>>;

  /**
The static tool calls that were made in the last step.
*/
  readonly staticToolCalls: Array<StaticToolCall<TOOLS>>;

  /**
The dynamic tool calls that were made in the last step.
*/
  readonly dynamicToolCalls: Array<DynamicToolCall>;

  /**
The results of the tool calls.
*/
  readonly toolResults: Array<TypedToolResult<TOOLS>>;

  /**
The static tool results that were made in the last step.
*/
  readonly staticToolResults: Array<StaticToolResult<TOOLS>>;

  /**
The dynamic tool results that were made in the last step.
*/
  readonly dynamicToolResults: Array<DynamicToolResult>;

  /**
   * The unified reason why the generation finished.
   */
  readonly finishReason: FinishReason;

  /**
   * The raw reason why the generation finished (from the provider).
   */
  readonly rawFinishReason: string | undefined;

  /**
The token usage of the generated text.
*/
  readonly usage: LanguageModelUsage;

  /**
Warnings from the model provider (e.g. unsupported settings).
*/
  readonly warnings: CallWarning[] | undefined;

  /**
Additional request information.
   */
  readonly request: LanguageModelRequestMetadata;

  /**
Additional response information.
*/
  readonly response: LanguageModelResponseMetadata & {
    /**
The response messages that were generated during the call.
Response messages can be either assistant messages or tool messages.
They contain a generated id.
*/
    readonly messages: Array<ResponseMessage>;

    /**
Response body (available only for providers that use HTTP requests).
     */
    body?: unknown;
  };

  /**
Additional provider-specific metadata. They are passed through
from the provider to the AI TOOLKIT and enable provider-specific
results that can be fully encapsulated in the provider.
   */
  readonly providerMetadata: ProviderMetadata | undefined;
};

export class DefaultStepResult<TOOLS extends ToolSet> implements StepResult<TOOLS> {
  readonly callId: StepResult<TOOLS>['callId'];
  readonly stepNumber: StepResult<TOOLS>['stepNumber'];
  readonly provider: StepResult<TOOLS>['provider'];
  readonly modelId: StepResult<TOOLS>['modelId'];
  readonly model: StepResult<TOOLS>['model'];
  readonly runtimeContext: StepResult<TOOLS>['runtimeContext'];
  readonly toolsContext: StepResult<TOOLS>['toolsContext'];
  readonly performance: StepResult<TOOLS>['performance'];
  readonly content: StepResult<TOOLS>['content'];
  readonly finishReason: StepResult<TOOLS>['finishReason'];
  readonly rawFinishReason: StepResult<TOOLS>['rawFinishReason'];
  readonly usage: StepResult<TOOLS>['usage'];
  readonly warnings: StepResult<TOOLS>['warnings'];
  readonly request: StepResult<TOOLS>['request'];
  readonly response: StepResult<TOOLS>['response'];
  readonly providerMetadata: StepResult<TOOLS>['providerMetadata'];

  constructor({
    callId = '',
    stepNumber = 0,
    provider = '',
    modelId = '',
    runtimeContext = {} as Context,
    toolsContext = {} as InferToolSetContext<TOOLS>,
    performance = {
      responseTimeMs: 0,
      effectiveOutputTokensPerSecond: 0,
      outputTokensPerSecond: undefined,
      inputTokensPerSecond: undefined,
      effectiveTotalTokensPerSecond: 0,
      timeToFirstOutputMs: undefined,
      timeBetweenOutputChunksMs: undefined,
      toolExecutionMs: {},
    },
    content,
    finishReason,
    rawFinishReason,
    usage,
    warnings,
    request,
    response,
    providerMetadata,
  }: {
    callId?: StepResult<TOOLS>['callId'];
    stepNumber?: StepResult<TOOLS>['stepNumber'];
    provider?: StepResult<TOOLS>['provider'];
    modelId?: StepResult<TOOLS>['modelId'];
    runtimeContext?: StepResult<TOOLS>['runtimeContext'];
    toolsContext?: StepResult<TOOLS>['toolsContext'];
    performance?: StepResult<TOOLS>['performance'];
    content: StepResult<TOOLS>['content'];
    finishReason: StepResult<TOOLS>['finishReason'];
    rawFinishReason: StepResult<TOOLS>['rawFinishReason'];
    usage: StepResult<TOOLS>['usage'];
    warnings: StepResult<TOOLS>['warnings'];
    request: StepResult<TOOLS>['request'];
    response: StepResult<TOOLS>['response'];
    providerMetadata: StepResult<TOOLS>['providerMetadata'];
  }) {
    this.callId = callId;
    this.stepNumber = stepNumber;
    this.provider = provider;
    this.modelId = modelId;
    this.model = { provider, modelId };
    this.runtimeContext = runtimeContext;
    this.toolsContext = toolsContext;
    this.performance = performance;
    this.content = content;
    this.finishReason = finishReason;
    this.rawFinishReason = rawFinishReason;
    this.usage = usage;
    this.warnings = warnings;
    this.request = request;
    this.response = response;
    this.providerMetadata = providerMetadata;
  }

  get text() {
    return this.content
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
  }

  get reasoning() {
    return this.content.filter(part => part.type === 'reasoning');
  }

  get reasoningText() {
    return this.reasoning.length === 0
      ? undefined
      : this.reasoning.map(part => part.text).join('');
  }

  get files() {
    return this.content
      .filter(part => part.type === 'file')
      .map(part => part.file);
  }

  get sources() {
    return this.content.filter(part => part.type === 'source');
  }

  get toolCalls() {
    return this.content.filter(part => part.type === 'tool-call');
  }

  get staticToolCalls() {
    return this.toolCalls.filter(
      (toolCall): toolCall is StaticToolCall<TOOLS> =>
        toolCall.dynamic !== true,
    );
  }

  get dynamicToolCalls() {
    return this.toolCalls.filter(
      (toolCall): toolCall is DynamicToolCall => toolCall.dynamic === true,
    );
  }

  get toolResults() {
    return this.content.filter(part => part.type === 'tool-result');
  }

  get staticToolResults() {
    return this.toolResults.filter(
      (toolResult): toolResult is StaticToolResult<TOOLS> =>
        toolResult.dynamic !== true,
    );
  }

  get dynamicToolResults() {
    return this.toolResults.filter(
      (toolResult): toolResult is DynamicToolResult =>
        toolResult.dynamic === true,
    );
  }
}
