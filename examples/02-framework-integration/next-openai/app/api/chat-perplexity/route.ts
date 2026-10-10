import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from '@ai-toolkit/ai';
import { perplexity } from '@ai-toolkit/perplexity';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: perplexity('sonar-reasoning'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
