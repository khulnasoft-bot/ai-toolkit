import { ModelMessage, generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

export async function POST(req: Request) {
  const { messages }: { messages: ModelMessage[] } = await req.json();

  const { response } = await generateText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return Response.json({ messages: response.messages });
}
