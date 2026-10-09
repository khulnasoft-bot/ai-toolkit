import {
  consumeStream,
  convertToModelMessages,
  streamText,
  type UIMessage,
} from '@ai-toolkit/ai';
import { DEFAULT_MODEL, resolveModelId } from '@/lib/providers';

export const maxDuration = 30;

interface ChatRequestBody {
  messages: UIMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  system?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const {
    messages,
    model = DEFAULT_MODEL,
    temperature,
    maxOutputTokens,
    system,
  } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages is required' }, { status: 400 });
  }

  const result = streamText({
    model: resolveModelId(model),
    messages: await convertToModelMessages(messages),
    ...(system ? { system } : {}),
    ...(typeof temperature === 'number' ? { temperature } : {}),
    ...(typeof maxOutputTokens === 'number' ? { maxOutputTokens } : {}),
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log('Playground chat aborted');
      }
    },
    consumeSseStream: consumeStream, // needed for correct abort handling
  });
}
