import { type InferAgentUIMessage, ToolLoopAgent } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { weatherTool } from '@/tool/weather-tool';

export const weatherAgent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
  tools: {
    weather: weatherTool,
  },
});

export type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
