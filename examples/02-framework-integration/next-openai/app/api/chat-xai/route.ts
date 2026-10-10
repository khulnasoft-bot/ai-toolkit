import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from '@ai-toolkit/ai';
import { xai } from '@ai-toolkit/xai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai('grok-beta'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
