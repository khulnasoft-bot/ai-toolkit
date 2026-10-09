import { TemplateBrowser } from '@/components/template-browser';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import { getTemplateCategories } from '@/lib/templates';
import { resourcesTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'Templates',
};

export default function TemplatesPage() {
  const categories = getTemplateCategories();

  return (
    <div>
      <PageTabs items={resourcesTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Templates"
          title="The fastest path from idea to AI app."
          description="Start from official app templates, examples, and framework integrations — with the right primitives already wired up."
        />
        <div className="mt-10">
          <TemplateBrowser categories={categories} />
        </div>
      </div>
    </div>
  );
}
