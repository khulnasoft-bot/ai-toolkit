import {
  CommandPromptContent,
  CommandPromptCopy,
  CommandPromptList,
  CommandPromptPrefix,
  CommandPromptRoot,
  CommandPromptSurface,
  CommandPromptTrigger,
  CommandPromptTriggerDivider,
  CommandPromptViewport,
} from "@ai-toolkit/ai-docs/components/command-prompt";
import type { AiDocsAgentReadinessConfig } from "@ai-toolkit/ai-docs/config";
import type { Metadata } from "next";
import { config } from "@/lib/ai-docs/config";
import { getLocalizedPath } from "@/lib/ai-docs/public-path";
import { CenteredSection } from "./components/centered-section";
import { CTA } from "./components/cta";
import { Hero } from "./components/hero";
import { OneTwoSection } from "./components/one-two-section";
import { TextGridSection } from "./components/text-grid-section";

const title = "AiDocs";
const description =
  "A Vercel documentation template built with Next.js and Fumadocs. Designed for spinning up documentation sites quickly and consistently.";

export const generateMetadata = async ({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> => {
  const { lang } = await params;
  const agentConfig = config.agent as AiDocsAgentReadinessConfig | undefined;

  return {
    title,
    description,
    alternates: {
      ...(config.siteUrl
        ? {
            canonical: getLocalizedPath(lang, "/"),
            ...(agentConfig && agentConfig.enabled !== false
              ? {
                  types: {
                    "text/markdown": getLocalizedPath(lang, "/agents.md"),
                  },
                }
              : {}),
          }
        : {}),
    },
    openGraph: {
      title,
      description,
      type: "website",
      ...(config.siteUrl ? { url: getLocalizedPath(lang, "/") } : {}),
    },
  };
};

const textGridSection = [
  {
    id: "runtime",
    title: "Package-backed runtime",
    description:
      "Share navigation, search, Ask AI, page actions, and rendering behavior through one versioned package.",
  },
  {
    id: "content",
    title: "Project-owned content",
    description:
      "Keep documentation, configuration, and thin adapters in the product repository where teams already work.",
  },
  {
    id: "agents",
    title: "Agent-readable by default",
    description:
      "Publish llms.txt, agents.md, a semantic sitemap, and focused Markdown versions of documentation pages.",
  },
  {
    id: "shapes",
    title: "Flexible site shapes",
    description:
      "Support localized, versioned, multi-section, base-path, and root-mounted documentation without forking the runtime.",
  },
];

const COMMAND_FOR_HUMANS = "npx @ai-toolkit/ai-docs init";
const COMMAND_FOR_AGENTS = "npx @ai-toolkit/ai-docs init --agent";

const HomePage = async ({ params }: PageProps<"/[lang]">) => {
  const { lang } = await params;

  return (
    <div className="mx-auto w-full max-w-[1448px] px-4 sm:px-6">
      <Hero
        badge="AiDocs is now in beta"
        description={description}
        title={title}
      >
        <CommandPromptRoot defaultValue="humans">
          <CommandPromptList>
            <CommandPromptTrigger className="min-w-[90px]" value="humans">
              For humans
            </CommandPromptTrigger>
            <CommandPromptTriggerDivider />
            <CommandPromptTrigger className="min-w-[84px]" value="agents">
              For agents
            </CommandPromptTrigger>
          </CommandPromptList>
          <CommandPromptSurface>
            <CommandPromptPrefix>$</CommandPromptPrefix>
            <CommandPromptViewport>
              <CommandPromptContent
                copyValue={COMMAND_FOR_HUMANS}
                value="humans"
              >
                {COMMAND_FOR_HUMANS}
              </CommandPromptContent>
              <CommandPromptContent
                copyValue={COMMAND_FOR_AGENTS}
                value="agents"
              >
                {COMMAND_FOR_AGENTS}
              </CommandPromptContent>
            </CommandPromptViewport>
            <CommandPromptCopy />
          </CommandPromptSurface>
        </CommandPromptRoot>
      </Hero>
      <div className="flex flex-col">
        <TextGridSection
          className="@min-[640px]:mt-16 mt-12"
          data={textGridSection}
          description="AiDocs combines a shared runtime with local ownership, so documentation teams can standardize behavior without centralizing every page."
          title="A complete foundation for product documentation"
        />
        <CenteredSection
          align="left"
          description="Every generated project starts as a normal Next.js application. Write MDX locally, configure the shared shell, and deploy with the same workflow as the product it documents."
          title="Keep documentation close to the product"
        >
          <div className="grid gap-3 rounded-lg border bg-background-100 p-6 font-mono text-sm">
            <p>content/docs/ stores the documentation source.</p>
            <p>ai-docs.tsx defines product and agent metadata.</p>
            <p>@ai-toolkit/ai-docs provides the shared runtime.</p>
          </div>
        </CenteredSection>
        <OneTwoSection
          description="Agents can discover the documentation corpus, choose a focused page, and recover from stale links without parsing the interactive application shell."
          title="Give agents a direct path through the docs"
        >
          <ul className="grid gap-4 rounded-lg border bg-background-100 p-6 text-gray-900">
            <li>
              <a
                className="underline"
                href={getLocalizedPath(lang, "/agents.md")}
              >
                /agents.md
              </a>{" "}
              explains when to use the product and where to find authoritative
              context.
            </li>
            <li>
              <a
                className="underline"
                href={getLocalizedPath(lang, "/sitemap.md")}
              >
                /sitemap.md
              </a>{" "}
              maps documentation pages by purpose, summary, and prerequisites.
            </li>
            <li>
              <a
                className="underline"
                href={getLocalizedPath(lang, "/llms.txt")}
              >
                /llms.txt
              </a>{" "}
              provides the complete documentation corpus as Markdown.
            </li>
          </ul>
        </OneTwoSection>
        <CTA cta="Get started" href="/docs" title="Start your docs today" />
      </div>
    </div>
  );
};

export default HomePage;
