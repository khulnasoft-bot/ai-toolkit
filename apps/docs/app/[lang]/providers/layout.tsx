import { DocsLayout } from '@/components/ai-docs/docs-layout';
import { getRootLang } from '@/lib/ai-docs/root-params';
import { providersSource } from '@/lib/ai-docs/source';

const Layout = async ({ children }: LayoutProps<'/[lang]/providers'>) => {
  const lang = await getRootLang();

  return (
    <div className="bg-background-200">
      <DocsLayout tree={providersSource.source.pageTree[lang]}>
        {children}
      </DocsLayout>
    </div>
  );
};

export default Layout;
