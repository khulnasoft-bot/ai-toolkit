import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

export const openaiCodeInterpreterAgent = new ToolLoopAgent({
  model: openai('gpt-5-nano'),
  tools: {
    executeCode: openai.tools.codeInterpreter(),
  },
});

export type OpenAICodeInterpreterMessage = InferAgentUIMessage<typeof openaiCodeInterpreterAgent>;
