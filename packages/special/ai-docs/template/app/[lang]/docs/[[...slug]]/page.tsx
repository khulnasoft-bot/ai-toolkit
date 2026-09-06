import { MobileDocsBar } from "@ai-toolkit/ai-docs/mobile-docs-bar";
import { createDocsPage } from "@ai-toolkit/ai-docs/pages/docs";
import { getMDXComponents } from "@/components/ai-docs/mdx-components";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

const docsPage = createDocsPage({
  config,
  mdx: ({ link }) => getMDXComponents({ a: link }),
  openGraph: {
    images: true,
  },
  source: aiDocsSource,
  tableOfContentPopover: {
    enabled: false,
  },
  renderTop: ({ data }) => <MobileDocsBar toc={data.toc} />,
});

export default docsPage.Page;
export const generateStaticParams = docsPage.generateStaticParams;
export const generateMetadata = docsPage.generateMetadata;
