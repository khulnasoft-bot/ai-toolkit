import { createSitemapMarkdownRoute } from '@ai-toolkit/ai-docs/routes/sitemap';
import { config } from '@/lib/ai-docs/config';
import {
  cookbookSource,
  aiDocsSource,
  providersSource,
} from '@/lib/ai-docs/source';

export const { GET, generateStaticParams } = createSitemapMarkdownRoute({
  config,
  sources: [
    { source: aiDocsSource },
    { source: providersSource },
    { source: cookbookSource },
  ],
});
