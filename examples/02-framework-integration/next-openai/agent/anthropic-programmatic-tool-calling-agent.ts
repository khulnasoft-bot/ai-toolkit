import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import {
  type AnthropicProviderOptions,
  anthropic,
  forwardAnthropicContainerIdFromLastStep,
} from '@ai-toolkit/anthropic';
import { z } from 'zod';
import { rollDieToolWithProgrammaticCalling } from '@/tool/roll-die-tool-with-programmatic-calling';

export const anthropicProgrammaticToolCallingAgent = new ToolLoopAgent({
  model: anthropic('claude-sonnet-4-5'),
  callOptionsSchema: z.object({
    containerId: z.string().optional(),
  }),
  tools: {
    code_execution: anthropic.tools.codeExecution_20250825(),
    rollDie: rollDieToolWithProgrammaticCalling,
  },

  prepareCall: ({ options, ...rest }) => ({
    ...rest,
    providerOptions: {
      anthropic: {
        container: {
          id: options?.containerId,
        },
      } satisfies AnthropicProviderOptions as any,
    },
  }),

  // Pass container ID between steps within the same stream
  prepareStep: forwardAnthropicContainerIdFromLastStep,
});

export type AnthropicProgrammaticToolCallingMessage = InferAgentUIMessage<
  typeof anthropicProgrammaticToolCallingAgent
>;
