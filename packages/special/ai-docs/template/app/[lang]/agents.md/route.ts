import { createAgentsRoute } from "@ai-toolkit/ai-docs/routes/agents";
import { config } from "@/lib/ai-docs/config";

export const { GET, generateStaticParams } = createAgentsRoute({
  config,
});
