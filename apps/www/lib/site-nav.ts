export interface PageTab {
  label: string;
  href: string;
}

export const resourcesTabs: PageTab[] = [
  { label: 'Overview', href: '/resources' },
  { label: 'Recipes', href: '/resources/recipes' },
  { label: 'Tools', href: '/resources/tools' },
  { label: 'Templates', href: '/resources/templates' },
  { label: 'Showcase', href: '/resources/showcase' },
];

export const providersTabs: PageTab[] = [
  { label: 'Overview', href: '/providers' },
  { label: 'AI Toolkit', href: '/providers/ai-toolkit-providers' },
  {
    label: 'OpenAI-Compatible',
    href: '/providers/openai-compatible-providers',
  },
  { label: 'Community', href: '/providers/community-providers' },
  { label: 'Adapters', href: '/providers/adapters' },
  { label: 'Observability', href: '/providers/observability' },
];

export const gatewaysTabs: PageTab[] = [
  { label: 'Overview', href: '/gateways' },
  { label: 'Models', href: '/gateways/models' },
];
