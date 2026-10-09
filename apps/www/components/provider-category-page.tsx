import { PageTabs } from '@/components/page-tabs';
import { ProviderBrowser } from '@/components/provider-browser';
import { SectionHeader } from '@/components/section-header';
import {
  getProviderCategory,
  getProviders,
  type ProviderCategoryId,
} from '@/lib/providers';
import { providersTabs } from '@/lib/site-nav';

export function ProviderCategoryPage({
  categoryId,
}: {
  categoryId: ProviderCategoryId;
}) {
  const category = getProviderCategory(categoryId);
  if (!category) return null;

  const providers = getProviders(categoryId);

  return (
    <div>
      <PageTabs items={providersTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow={category.eyebrow}
          title={category.title}
          description={category.description}
        />
        <div className="mt-8">
          <ProviderBrowser providers={providers} docsSlug={category.docsSlug} />
        </div>
      </div>
    </div>
  );
}
