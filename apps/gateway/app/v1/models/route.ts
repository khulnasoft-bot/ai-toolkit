import { loadPolicy } from '@/lib/config';
import { supportedProviders } from '@/lib/providers';

/** Public catalog: which gateway model IDs route to which providers. */
export async function GET() {
  const policy = loadPolicy();
  return Response.json({
    models: policy.routes.map(route => ({
      pattern: route.modelPattern,
      strategy: route.strategy ?? 'ordered',
      retryBudget: route.retryBudget,
      providers: route.providers.map(provider => ({
        provider: provider.provider,
        model: provider.model,
        weight: provider.weight ?? 1,
      })),
    })),
    supportedProviders: supportedProviders(),
  });
}
