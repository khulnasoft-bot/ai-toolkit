import type {
  AiDocsAgentReadinessConfig,
  AiDocsAIConfig,
} from "@ai-toolkit/ai-docs/config";

export const Logo = () => (
  <span className="font-semibold text-gray-1000 text-lg leading-none tracking-[-3%]">
    AiDocs
  </span>
);

export const github = {
  branch: "main",
  editPath: "content/docs/{path}",
  owner: "vercel",
  repo: "ai-docs",
};

export const nav = [
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Source",
    href: `https://github.com/${github.owner}/${github.repo}/`,
  },
];

export const suggestions = [
  "What is AiDocs?",
  "What can I make with AiDocs?",
  "What syntax does AiDocs support?",
  "How do I deploy my AiDocs site?",
];

export const title = "AiDocs Documentation";

export const prompt =
  "You are a helpful assistant specializing in answering questions about AiDocs, a modern documentation template built with Next.js and Fumadocs.";

export const ai = {
  footer: (
    <div className="text-right">
      <a href="https://example.com">Powered by your AI provider</a>
    </div>
  ),
} satisfies AiDocsAIConfig;

export const agent = {
  product: {
    name: "AiDocs",
    description:
      "AiDocs is a package-backed documentation system for creating Next.js and Fumadocs sites with shared Vercel documentation patterns.",
    category: "Documentation",
    audience: ["Documentation authors", "Developer experience teams"],
    useCases: [
      "Create package-backed documentation sites",
      "Expose docs as AI-readable Markdown",
      "Share Vercel docs UI and runtime behavior across projects",
    ],
  },
  links: [
    {
      label: "AiDocs source",
      href: `https://github.com/${github.owner}/${github.repo}`,
      description: "Source repository for the AiDocs package and template",
    },
  ],
} satisfies AiDocsAgentReadinessConfig;

export const translations = {
  en: {
    displayName: "English",
  },
  cn: {
    displayName: "Chinese",
    search: "搜尋文檔",
  },
};

export const basePath: string | undefined = undefined;

/**
 * Unique identifier for this site, used in markdown request tracking analytics.
 * Each site using AiDocs should set this to a unique value (e.g. "ai-sdk-docs", "next-docs").
 */
export const siteId: string | undefined = undefined;
