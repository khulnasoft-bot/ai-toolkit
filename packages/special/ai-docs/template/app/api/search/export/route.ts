import { createSearchExportRoute } from "@ai-toolkit/ai-docs/routes/search-export";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET } = createSearchExportRoute({
  config,
  sources: [aiDocsSource],
});
