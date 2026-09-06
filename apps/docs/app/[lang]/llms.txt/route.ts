import { createLlmsRoute } from '@ai-toolkit/ai-docs/routes/llms';
import { sources } from '@/lib/ai-docs/source';

export const { GET } = createLlmsRoute({
  sources,
});
