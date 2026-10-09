import { ProviderCategoryPage } from '@/components/provider-category-page';

export const metadata = {
  title: 'Community Providers',
};

export default function ProvidersPage() {
  return <ProviderCategoryPage categoryId="community" />;
}
