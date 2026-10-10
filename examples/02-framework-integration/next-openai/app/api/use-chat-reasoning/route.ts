import { convertToModelMessages, streamText } from '@ai-toolkit/ai';
import {
  type OpenAIResponsesProviderOptions,
  openai,
} from '@ai-toolkit/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-5-nano'),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningSummary: 'detailed', // 'auto' for condensed or 'detailed' for comprehensive
      } satisfies OpenAIResponsesProviderOptions,
    },
    onFinish: ({ request }) => {
      console.dir(request.body, { depth: null });
    },
  });

  return result.toUIMessageStreamResponse();
}
