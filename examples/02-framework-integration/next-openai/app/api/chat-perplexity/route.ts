import { perplexity } from '@ai-toolkit/perplexity';
import { convertToModelMessages, streamText, UIMessage } from '@ai-toolkit/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: perplexity('sonar-reasoning'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
