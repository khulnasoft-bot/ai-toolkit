import { ToolBrowser } from '@/components/tool-browser';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import {
  getToolCategoriesWithCounts,
  toolCategoryOf,
  tools,
} from '@/lib/tools';
import { resourcesTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'Tools Registry',
};

export default function ToolsPage() {
  const categories = getToolCategoriesWithCounts();
  const toolsWithCategory = tools.map(tool => ({
    ...tool,
    category: toolCategoryOf(tool),
  }));

  return (
    <div>
      <PageTabs items={resourcesTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Tools registry"
          title="Give your agent superpowers."
          description="Browse community-built tools that add web search, extraction, code execution, and more. Install a tool, define a schema, ship."
        />
        <div className="mt-10">
          <ToolBrowser categories={categories} tools={toolsWithCategory} />
        </div>
      </div>
    </div>
  );
}
