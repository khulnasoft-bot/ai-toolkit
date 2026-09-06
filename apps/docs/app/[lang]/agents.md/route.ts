import type { NextRequest } from 'next/server';
import { createAgentsRoute } from '@ai-toolkit/ai-docs/routes/agents';
import { config } from '@/lib/ai-docs/config';

const route = createAgentsRoute({
  config,
});

// Wrapped so the exports satisfy Next's strict route-type validators
// (the factory types its context argument as optional).
export const GET = (
  request: NextRequest,
  context: RouteContext<'/[lang]/agents.md'>,
) => route.GET(request, context);

export const generateStaticParams = route.generateStaticParams;
