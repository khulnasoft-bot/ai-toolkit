import { requireKey } from '@/lib/request';
import { readUsage, summarizeUsage } from '@/lib/usage';

/**
 * Usage and spend summary for the caller's key (default) or tenant.
 *
 * Query params: `scope=key|tenant` (default `key`), `model`, `from`, `to`
 * (epoch millis). Callers only ever see their own tenant.
 */
export async function GET(req: Request) {
  const auth = await requireKey(req, 'gateway:chat');
  if (!auth.ok) return auth.response;
  const { context } = auth;

  const params = new URL(req.url).searchParams;
  const scope = params.get('scope') === 'tenant' ? 'tenant' : 'key';
  const parseNumber = (value: string | null): number | undefined => {
    if (value === null) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const summary = summarizeUsage(await readUsage(), {
    keyId: scope === 'key' ? context.keyId : undefined,
    tenantId: context.tenantId,
    model: params.get('model') ?? undefined,
    from: parseNumber(params.get('from')),
    to: parseNumber(params.get('to')),
  });

  return Response.json({
    scope,
    tenantId: context.tenantId,
    keyId: context.keyId,
    budgetCap: context.budgetCap ?? null,
    ...summary,
  });
}
