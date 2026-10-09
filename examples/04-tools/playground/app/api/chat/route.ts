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

  // Optional self-hosted path: forward to apps/gateway when configured.
  // Falls back to direct streaming (hosted gateway) otherwise.
  const gatewayUrl = process.env.AI_GATEWAY_URL?.replace(/\/$/, '');
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayUrl && gatewayKey) {
    const upstream = await fetch(`${gatewayUrl}/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gatewayKey}`,
      },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        maxOutputTokens,
        system,
      }),
      signal: req.signal,
    });
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '');
      return Response.json(
        {
          error: `gateway upstream ${upstream.status}: ${detail.slice(0, 200)}`,
        },
        { status: 502 },
      );
    }
    return new Response(upstream.body, {
      headers: {
        'Content-Type':
          upstream.headers.get('Content-Type') ?? 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
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
