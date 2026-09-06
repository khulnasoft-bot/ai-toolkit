import { createSearchRoute } from "@ai-toolkit/ai-docs/routes/search";
import { config } from "@/lib/ai-docs/config";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const GET = createSearchRoute({ config, sources: [aiDocsSource] });
