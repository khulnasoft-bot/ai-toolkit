import { DocsLayout } from '@/components/ai-docs/docs-layout';
import { getRootLang } from '@/lib/ai-docs/root-params';
import { cookbookSource } from '@/lib/ai-docs/source';

const Layout = async ({ children }: LayoutProps<'/[lang]/cookbook'>) => {
  const lang = await getRootLang();

  return (
    <div className="bg-background-200">
      <DocsLayout tree={cookbookSource.source.pageTree[lang]}>
        {children}
      </DocsLayout>
    </div>
  );
};

export default Layout;
