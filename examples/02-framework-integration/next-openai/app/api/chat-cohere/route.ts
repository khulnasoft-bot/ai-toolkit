import { cohere } from '@ai-toolkit/cohere';
import { convertToModelMessages, streamText, UIMessage } from '@ai-toolkit/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: cohere('command-r-plus'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
