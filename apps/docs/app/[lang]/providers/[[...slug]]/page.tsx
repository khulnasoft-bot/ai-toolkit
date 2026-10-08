import { createFamilyDocsPage } from '@/lib/ai-docs/docs-page';
import { providersSource } from '@/lib/ai-docs/source';

const providersPage = createFamilyDocsPage(providersSource);

export default providersPage.Page;
export const generateStaticParams = providersPage.generateStaticParams;
export const generateMetadata = providersPage.generateMetadata;
