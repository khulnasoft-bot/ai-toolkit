/**
 * Legacy `/examples` redirects for the AI TOOLKIT docs fork. Docs content
 * still links to these paths; they chain to their cookbook replacements.
 */
export const exampleRedirects: {
  source: string;
  destination: string;
  permanent: boolean;
}[] = [
  {
    source: '/examples/next-app/basics/streaming-text-generation',
    destination: '/cookbook/next/stream-text',
    permanent: true,
  },
  {
    source: '/examples/next-app/basics/generating-text',
    destination: '/cookbook/next/generate-text',
    permanent: true,
  },
  {
    source: '/examples/next-app/basics/streaming-object-generation',
    destination: '/cookbook/next/stream-object',
    permanent: true,
  },
  {
    source: '/examples/next-app/basics/generating-object',
    destination: '/cookbook/next/generate-object',
    permanent: true,
  },
  {
    source: '/examples/next-app/tools',
    destination: '/cookbook/next/call-tools',
    permanent: true,
  },
  {
    source: '/examples/next-app/tools/call-tool',
    destination: '/cookbook/next/call-tools',
    permanent: true,
  },
  {
    source: '/examples/next-app/tools/render-interface-during-tool-call',
    destination: '/cookbook/next/render-visual-interface-in-chat',
    permanent: true,
  },
  {
    source: '/examples/next-app/chat/stream-chat-completion',
    destination: '/cookbook/next/stream-text-with-chat-prompt',
    permanent: true,
  },
  {
    source: '/examples/next-app/interface',
    destination: '/cookbook/next/render-visual-interface-in-chat',
    permanent: true,
  },
  {
    source: '/examples/next-app/interface/route-components',
    destination: '/cookbook/next/render-visual-interface-in-chat',
    permanent: true,
  },
  {
    source: '/examples/next-app/interface/stream-component-updates',
    destination: '/cookbook/rsc/stream-updates-to-visual-interfaces',
    permanent: true,
  },
  {
    source: '/examples/next-app/state-management/ai-ui-states',
    destination: '/cookbook/rsc/render-visual-interface-in-chat',
    permanent: true,
  },
  {
    source: '/examples/next-app/state-management/save-and-restore-states',
    destination: '/cookbook/rsc/save-messages-to-database',
    permanent: true,
  },
  {
    source: '/examples/next-pages/basics/streaming-text-generation',
    destination: '/cookbook/next/stream-text',
    permanent: true,
  },
  {
    source: '/examples/next-pages/basics/generating-text',
    destination: '/cookbook/next/generate-text',
    permanent: true,
  },
  {
    source: '/examples/next-pages/basics/streaming-object-generation',
    destination: '/cookbook/next/stream-object',
    permanent: true,
  },
  {
    source: '/examples/next-pages/basics/generating-object',
    destination: '/cookbook/next/generate-object',
    permanent: true,
  },
  {
    source: '/examples/node/generating-text/generate-text',
    destination: '/cookbook/node/generate-text',
    permanent: true,
  },
  {
    source: '/examples/node/generating-text/stream-text',
    destination: '/cookbook/node/stream-text',
    permanent: true,
  },
  {
    source: '/examples/node/generating-text/generate-text-with-chat-prompt',
    destination: '/cookbook/node/generate-text-with-chat-prompt',
    permanent: true,
  },
  {
    source: '/examples/node/generating-text/stream-text-with-chat-prompt',
    destination: '/cookbook/node/stream-text-with-chat-prompt',
    permanent: true,
  },
  {
    source: '/examples/node/generating-structured-data/generate-object',
    destination: '/cookbook/node/generate-object',
    permanent: true,
  },
  {
    source: '/examples/node/streaming-structured-data/stream-object',
    destination: '/cookbook/node/stream-object',
    permanent: true,
  },
  {
    source: '/examples/node/streaming-structured-data/object',
    destination: '/cookbook/node/stream-object',
    permanent: true,
  },
  {
    source: '/examples/node/streaming-structured-data/token-usage',
    destination: '/cookbook/node/stream-object-record-token-usage',
    permanent: true,
  },
  {
    source: '/examples/node/tools/call-tools-multiple-steps',
    destination: '/cookbook/node/call-tools-multiple-steps',
    permanent: true,
  },
  {
    source: '/examples/providers/intercepting-fetch-requests',
    destination: '/cookbook/node/intercept-fetch-requests',
    permanent: true,
  },
  {
    source: '/examples/api-servers/node-js-http-server',
    destination: '/cookbook/api-servers/node-http-server',
    permanent: true,
  },
  {
    source: '/examples/api-servers/express',
    destination: '/cookbook/api-servers/express',
    permanent: true,
  },
  {
    source: '/examples/api-servers/hono',
    destination: '/cookbook/api-servers/hono',
    permanent: true,
  },
  {
    source: '/examples/api-servers/fastify',
    destination: '/cookbook/api-servers/fastify',
    permanent: true,
  },
  {
    source: '/examples/api-servers/nest',
    destination: '/cookbook/api-servers/nest',
    permanent: true,
  },
  // Family-level fallbacks for any other legacy example URLs.
  {
    source: '/examples/next-app/:path*',
    destination: '/cookbook/next/generate-text',
    permanent: false,
  },
  {
    source: '/examples/next-pages/:path*',
    destination: '/cookbook/next/generate-text',
    permanent: false,
  },
  {
    source: '/examples/node/:path*',
    destination: '/cookbook/node/generate-text',
    permanent: false,
  },
  {
    source: '/examples/api-servers/:path*',
    destination: '/cookbook/api-servers/node-http-server',
    permanent: false,
  },
];
