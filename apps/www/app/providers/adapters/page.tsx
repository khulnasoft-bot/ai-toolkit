import { ProviderCategoryPage } from '@/components/provider-category-page';

export const metadata = {
  title: 'Framework Adapters',
};

export default function ProvidersPage() {
  return <ProviderCategoryPage categoryId="adapters" />;
}
