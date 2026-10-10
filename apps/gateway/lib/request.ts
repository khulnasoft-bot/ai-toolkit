import {
  InvalidKeyError,
  validateKey,
  type KeyContext,
} from '@ai-toolkit/security-auth';
import { FileKeyStore } from './keys';

export function extractBearer(req: Request): string | undefined {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim() || undefined;
}

export type KeyAuth =
  | { ok: true; context: KeyContext }
  | { ok: false; response: Response };

/** Validate the bearer key and require a scope. Never throws. */
export async function requireKey(
  req: Request,
  scope: string,
): Promise<KeyAuth> {
  const secret = extractBearer(req);
  if (!secret) {
    return {
      ok: false,
      response: Response.json(
        { error: 'missing bearer API key' },
        { status: 401 },
      ),
    };
  }
  let context: KeyContext;
  try {
    context = await validateKey(new FileKeyStore(), secret);
  } catch (error) {
    const status = error instanceof InvalidKeyError ? 401 : 500;
    return {
      ok: false,
      response: Response.json({ error: 'invalid API key' }, { status }),
    };
  }
  if (!context.scopes.includes(scope)) {
    return {
      ok: false,
      response: Response.json(
        { error: `API key lacks ${scope} scope` },
        { status: 403 },
      ),
    };
  }
  return { ok: true, context };
}
