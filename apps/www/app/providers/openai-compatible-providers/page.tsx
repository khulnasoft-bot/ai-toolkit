import { ProviderCategoryPage } from '@/components/provider-category-page';

export const metadata = {
  title: 'OpenAI-Compatible Providers',
};

export default function ProvidersPage() {
  return <ProviderCategoryPage categoryId="openai-compatible" />;
}
