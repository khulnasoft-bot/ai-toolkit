import { convertToModelMessages, streamText, type UIMessage } from '@ai-toolkit/ai';
import { google } from '@ai-toolkit/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
