import { openai } from '@ai-toolkit/openai';
import { streamText } from '@ai-toolkit/ai';

export const runtime = 'edge';

export default async function handler(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo-preview'),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
