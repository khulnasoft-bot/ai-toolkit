import { loadCatalog } from '@/lib/catalog';
import { loadPolicy, loadPrices } from '@/lib/config';
import { supportedProviders } from '@/lib/providers';

/** Public catalog: which gateway model IDs route to which providers, at what price. */
export async function GET() {
  const policy = loadPolicy();
  const prices = loadPrices();
  const priceFor = (pattern: string) =>
    prices.entries.find(entry => entry.modelPattern === pattern) ?? null;
  return Response.json({
    currency: prices.currency,
    models: policy.routes.map(route => {
      const price = priceFor(route.modelPattern);
      return {
        pattern: route.modelPattern,
        strategy: route.strategy ?? 'ordered',
        retryBudget: route.retryBudget,
        providers: route.providers.map(provider => ({
          provider: provider.provider,
          model: provider.model,
          weight: provider.weight ?? 1,
        })),
        price: price
          ? {
              inputPer1k: price.inputPer1k,
              outputPer1k: price.outputPer1k,
              currency: price.currency,
            }
          : null,
      };
    }),
    catalog: loadCatalog(),
    supportedProviders: supportedProviders(),
  });
}
