import { gateways } from './gateways';
import { getGatewayModels } from './models';
import { getProviders } from './providers';
import { tools } from './tools';
import type { SearchItem } from './types';

export function getSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const gateway of gateways) {
    items.push({
      label: gateway.name,
      href: '/gateways',
      section: 'Gateways',
      keywords: gateway.developer,
    });
  }

  for (const model of getGatewayModels()) {
    items.push({
      label: model.id,
      href: '/models',
      section: 'Models',
      keywords: model.providerName,
    });
  }

  for (const provider of getProviders()) {
    items.push({
      label: provider.name,
      href: '/providers',
      section: 'Providers',
      keywords: provider.slug,
    });
  }

  for (const tool of tools) {
    items.push({
      label: tool.name,
      href: '/tools',
      section: 'Tools',
      keywords: tool.packageName,
    });
  }

  return items;
}
