import {
  defineAiDocsSourceConfig,
  aiDocsFrontmatterSchema,
  aiDocsMetaSchema,
} from "@ai-toolkit/ai-docs/source-config";
import { defineDocs } from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: aiDocsFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: aiDocsMetaSchema,
  },
});

export default defineAiDocsSourceConfig();
