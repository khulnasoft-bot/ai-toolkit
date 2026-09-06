import { createMcpManifestRoute } from "@ai-toolkit/ai-docs/routes/mcp";
import { config } from "@/lib/ai-docs/config";

export const { GET, generateStaticParams } = createMcpManifestRoute({
  config,
});
