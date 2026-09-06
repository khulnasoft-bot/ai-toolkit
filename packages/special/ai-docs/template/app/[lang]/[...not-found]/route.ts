import { createNotFoundRoute } from "@ai-toolkit/ai-docs/routes/not-found";
import { config } from "@/lib/ai-docs/config";

export const { GET } = createNotFoundRoute({ config });
