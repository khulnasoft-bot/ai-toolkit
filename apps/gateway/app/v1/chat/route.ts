import {
  consumeStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from '@ai-toolkit/ai';
import { resolveCandidates } from '@ai-toolkit/gateway-router';
import { InvalidKeyError, validateKey } from '@ai-toolkit/security-auth';
import { loadPolicy } from '@/lib/config';
import { streamWithFailover } from '@/lib/executor';
import { FileKeyStore } from '@/lib/keys';
import { recordUsage } from '@/lib/ledger';
import { createProviderModel, supportedProviders } from '@/lib/providers';

export const maxDuration = 60;

interface ChatRequestBody {
  messages: UIMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  system?: string;
}

function extractBearer(req: Request): string | undefined {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim() || undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function POST(req: Request) {
  const secret = extractBearer(req);
  if (!secret) {
    return Response.json({ error: 'missing bearer API key' }, { status: 401 });
  }

  let keyContext;
  try {
    keyContext = await validateKey(new FileKeyStore(), secret);
  } catch (error) {
    const status = error instanceof InvalidKeyError ? 401 : 500;
    return Response.json({ error: 'invalid API key' }, { status });
  }

  if (!keyContext.scopes.includes('gateway:chat')) {
    return Response.json(
      { error: 'API key lacks gateway:chat scope' },
      { status: 403 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: 'request body must be JSON' },
      { status: 400 },
    );
  }
  if (
    !isRecord(body) ||
    !Array.isArray(body.messages) ||
    body.messages.length === 0
  ) {
    return Response.json(
      { error: 'messages must be a non-empty array' },
      { status: 400 },
    );
  }
  if (body.model !== undefined && typeof body.model !== 'string') {
    return Response.json({ error: 'model must be a string' }, { status: 400 });
  }

  const modelId = body.model ?? 'openai/gpt-4o-mini';
  const routed = resolveCandidates(loadPolicy(), modelId);
  if (!routed) {
    return Response.json(
      { error: `no route for model "${modelId}"` },
      { status: 400 },
    );
  }
  if (
    !routed.candidates.some(candidate =>
      supportedProviders().includes(candidate.provider),
    )
  ) {
    return Response.json(
      {
        error: `no configured provider for model "${modelId}" (supported: ${supportedProviders().join(', ')})`,
      },
      { status: 502 },
    );
  }
  // Fail fast on config errors (missing credentials, unknown provider) so
  // clients get a JSON error instead of a truncated stream.
  try {
    const first = routed.candidates.find(candidate =>
      supportedProviders().includes(candidate.provider),
    );
    if (first) createProviderModel(first.provider, first.model);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'provider unavailable',
      },
      { status: 502 },
    );
  }

  const modelMessages = await convertToModelMessages(body.messages);
  const stream = streamWithFailover({
    candidates: routed.candidates,
    attemptsRemaining: routed.attemptsRemaining,
    signal: req.signal,
    onAttemptFailure: ({ candidate, attemptNumber, kind, error }) => {
      console.warn(
        `gateway attempt ${attemptNumber} failed (${kind}): ${candidate.provider}/${candidate.model} for "${modelId}" — ${error instanceof Error ? error.message : String(error)}`,
      );
    },
    startAttempt: candidate => {
      const model = createProviderModel(candidate.provider, candidate.model);
      const result = streamText({
        model,
        messages: modelMessages,
        ...(typeof body.system === 'string' && body.system
          ? { system: body.system }
          : {}),
        ...(typeof body.temperature === 'number'
          ? { temperature: body.temperature }
          : {}),
        ...(typeof body.maxOutputTokens === 'number'
          ? { maxOutputTokens: body.maxOutputTokens }
          : {}),
        abortSignal: req.signal,
        onFinish: async ({ totalUsage }) => {
          recordUsage({
            tenantId: keyContext.tenantId,
            keyId: keyContext.keyId,
            model: modelId,
            provider: candidate.provider,
            promptTokens: totalUsage.inputTokens ?? 0,
            completionTokens: totalUsage.outputTokens ?? 0,
          });
        },
      });
      return result.toUIMessageStream();
    },
  });

  return createUIMessageStreamResponse({
    stream,
    consumeSseStream: consumeStream,
  });
}
