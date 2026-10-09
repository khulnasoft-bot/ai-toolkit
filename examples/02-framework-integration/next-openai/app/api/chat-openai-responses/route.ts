import { convertToModelMessages, streamText, type UIMessage } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai.responses('o3-mini'),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'auto',
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
