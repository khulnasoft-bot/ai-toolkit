import { google } from '@ai-toolkit/google';
import { streamText, convertToModelMessages } from '@ai-toolkit/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
