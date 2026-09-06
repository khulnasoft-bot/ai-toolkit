import { createProxy } from "@ai-toolkit/ai-docs/proxy";
import { config as aiDocsConfig } from "@/lib/ai-docs/config";
import { trackMdRequest } from "@/lib/ai-docs/md-tracking";

const proxy = createProxy({
  config: aiDocsConfig,
  trackMarkdownRequest: trackMdRequest,
  before: () => null,
});

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default proxy;
