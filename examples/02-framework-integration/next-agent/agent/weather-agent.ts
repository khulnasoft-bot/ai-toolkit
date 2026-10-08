import { weatherTool } from '@/tool/weather-tool';
import { openai } from '@ai-toolkit/openai';
import { ToolLoopAgent, InferAgentUIMessage } from '@ai-toolkit/ai';

export const weatherAgent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
  tools: {
    weather: weatherTool,
  },
});

export type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
