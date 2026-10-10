import type { ServerResponse } from 'node:http';
import type {
  StreamTextTransform,
  UIMessageStreamOptions,
} from '../generate-text';
import type { Output } from '../generate-text/output';
import type { ToolSet } from '../generate-text/tool-set';
import type { TimeoutConfiguration } from '../prompt/call-settings';
import type { InferUITools, UIMessage } from '../ui/ui-messages';
import { pipeUIMessageStreamToResponse } from '../ui-message-stream';
import type { UIMessageStreamResponseInit } from '../ui-message-stream/ui-message-stream-response-init';
import type { Agent } from './agent';
import { createAgentUIStream } from './create-agent-ui-stream';

/**
 * Pipes the agent UI message stream to a Node.js ServerResponse object.
 *
 * @param agent - The agent to run.
 * @param uiMessages - The input UI messages.
 */
export async function pipeAgentUIStreamToResponse<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT extends Output = never,
  MESSAGE_METADATA = unknown,
>({
  response,
  headers,
  status,
  statusText,
  consumeSseStream,
  ...options
}: {
  response: ServerResponse;
  agent: Agent<CALL_OPTIONS, TOOLS, OUTPUT>;
  uiMessages: unknown[];
  abortSignal?: AbortSignal;
  timeout?: TimeoutConfiguration;
  options?: CALL_OPTIONS;
  experimental_transform?:
    | StreamTextTransform<TOOLS>
    | Array<StreamTextTransform<TOOLS>>;
} & UIMessageStreamResponseInit &
  UIMessageStreamOptions<
    UIMessage<MESSAGE_METADATA, never, InferUITools<TOOLS>>
  >): Promise<void> {
  pipeUIMessageStreamToResponse({
    response,
    headers,
    status,
    statusText,
    consumeSseStream,
    stream: await createAgentUIStream(options),
  });
}
