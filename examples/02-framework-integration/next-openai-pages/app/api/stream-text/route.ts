import { streamText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
