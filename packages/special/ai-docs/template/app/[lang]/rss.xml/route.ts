import { getPublicPath } from "@ai-toolkit/ai-docs/config";
import { Feed } from "feed";
import { cacheLife } from "next/cache";
import type { NextRequest } from "next/server";
import { title } from "@/ai-docs";
import { config } from "@/lib/ai-docs/config";
import { absoluteUrl } from "@/lib/ai-docs/site-url";
import { source } from "@/lib/ai-docs/source";

const sitePath = getPublicPath("/", config.basePath);
const siteUrl = absoluteUrl(sitePath);

// biome-ignore lint/suspicious/useAwait: Next.js requires cached functions to be async.
const getFeed = async (lang: string) => {
  "use cache";
  cacheLife("max");

  const feed = new Feed({
    title,
    id: siteUrl,
    link: siteUrl,
    language: lang,
    copyright: `All rights reserved ${new Date().getFullYear()}, Vercel`,
  });

  for (const page of source.getPages(lang)) {
    const data = page.data as {
      description?: string;
      lastModified?: Date;
      title?: string;
    };

    feed.addItem({
      id: page.url,
      title: data.title ?? page.url,
      description: data.description,
      link: absoluteUrl(getPublicPath(page.url, config.basePath)),
      date: new Date(data.lastModified ?? new Date()),
      author: [
        {
          name: "Vercel",
        },
      ],
    });
  }

  return feed.rss2();
};

export const GET = async (
  _req: NextRequest,
  { params }: RouteContext<"/[lang]/rss.xml">
) => {
  const { lang } = await params;
  const rss = await getFeed(lang);

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
};
