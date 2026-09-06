import { AiDocsHomeLayout } from "@ai-toolkit/ai-docs/home-layout";
import { config } from "@/lib/ai-docs/config";
import { getRootLang } from "@/lib/ai-docs/root-params";
import { source } from "@/lib/ai-docs/source";

const Layout = async ({ children }: LayoutProps<"/[lang]">) => {
  const lang = await getRootLang();

  return (
    <AiDocsHomeLayout config={config} tree={source.pageTree[lang]}>
      <div className="pt-0 pb-32">{children}</div>
    </AiDocsHomeLayout>
  );
};

export default Layout;
