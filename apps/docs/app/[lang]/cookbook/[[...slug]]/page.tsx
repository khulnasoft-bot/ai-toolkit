import { createFamilyDocsPage } from '@/lib/ai-docs/docs-page';
import { cookbookSource } from '@/lib/ai-docs/source';

const cookbookPage = createFamilyDocsPage(cookbookSource);

export default cookbookPage.Page;
export const generateStaticParams = cookbookPage.generateStaticParams;
export const generateMetadata = cookbookPage.generateMetadata;
