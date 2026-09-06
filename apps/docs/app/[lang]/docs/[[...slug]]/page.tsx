import { createFamilyDocsPage } from '@/lib/ai-docs/docs-page';
import { aiDocsSource } from '@/lib/ai-docs/source';

const docsPage = createFamilyDocsPage(aiDocsSource);

export default docsPage.Page;
export const generateStaticParams = docsPage.generateStaticParams;
export const generateMetadata = docsPage.generateMetadata;
