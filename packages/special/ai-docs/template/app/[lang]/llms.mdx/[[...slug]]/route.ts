import { createDocsMarkdownRoute } from "@ai-toolkit/ai-docs/routes/llms";
import { aiDocsSource } from "@/lib/ai-docs/source";

export const { GET, generateStaticParams } = createDocsMarkdownRoute({
  sources: [aiDocsSource],
});
