import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { type AnthropicProviderOptions, anthropic } from '@ai-toolkit/anthropic';

export const anthropicMcpAgent = new ToolLoopAgent({
  model: anthropic('claude-sonnet-4-5'),
  providerOptions: {
    anthropic: {
      mcpServers: [
        {
          type: 'url',
          name: 'echo',
          url: 'https://echo.mcp.inevitable.fyi/mcp',
        },
      ],
    } satisfies AnthropicProviderOptions,
  },
});

export type AnthropicMcpMessage = InferAgentUIMessage<typeof anthropicMcpAgent>;
