import { openai } from '@ai-toolkit/openai';
import { convertToModelMessages, streamText, UIMessage } from '@ai-toolkit/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({});
}
