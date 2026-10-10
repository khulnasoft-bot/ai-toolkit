import { type InferUITools, type Tool, type UIMessage } from '@ai-toolkit/ai';
type WeatherTool = Tool<
  {
    location: string;
  },
  {
    temperature: number;
    condition: string;
  }
>;
type MyToolSet = {
  weather: WeatherTool;
};
export type MyUITools = InferUITools<MyToolSet>;
export type MyUIMessage = UIMessage<never, never, MyUITools>;
export declare const serverWeatherTool: Tool<
  {
    location: string;
  },
  {
    condition: string;
    temperature: number;
  },
  any
>;
export {};
