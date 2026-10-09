import { ProviderCategoryPage } from '@/components/provider-category-page';

export const metadata = {
  title: 'Observability',
};

export default function ProvidersPage() {
  return <ProviderCategoryPage categoryId="observability" />;
}
