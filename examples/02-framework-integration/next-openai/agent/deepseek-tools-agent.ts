import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { deepseek } from '@ai-toolkit/deepseek';
import { weatherTool } from '@/tool/weather-tool';

export const deepseekToolsAgent = new ToolLoopAgent({
  model: deepseek('deepseek-reasoner'),
  tools: { weather: weatherTool },
});

export type DeepSeekToolsAgentMessage = InferAgentUIMessage<
  typeof deepseekToolsAgent
>;
