import { ProviderCategoryPage } from '@/components/provider-category-page';

export const metadata = {
  title: 'AI Toolkit Providers',
};

export default function ProvidersPage() {
  return <ProviderCategoryPage categoryId="ai-toolkit" />;
}
