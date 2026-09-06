import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import {
  defineConfig as defineFumadocsConfig,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

// Mirrors src/internal/last-modified.ts. This file must stay dependency-free
// on dist so source.config.ts can load it before the package is built.
const execFileAsync = promisify(execFile);

const FRONTMATTER_BLOCK_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const LAST_MODIFIED_KEY_PATTERN =
  /^lastModified:\s*(?:"([^"]*)"|'([^']*)'|([^#\n]+?))\s*$/m;

const readFrontmatterLastModified = async (filePath) => {
  try {
    const contents = await readFile(filePath, "utf8");
    const block = contents.match(FRONTMATTER_BLOCK_PATTERN)?.[1];
    if (!block) {
      return null;
    }
    const match = block.match(LAST_MODIFIED_KEY_PATTERN);
    if (!match) {
      return null;
    }
    const value = match[1] ?? match[2] ?? match[3];
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// Resolves a page's last-modified date frontmatter-first, then the file's
// git author time, then null so surfaces omit the date. The frontmatter
// override keeps dates working on shallow clones, where git history for
// untouched files is unavailable.
const createLastModified = ({
  cwd = process.cwd(),
  gitBinary = "git",
} = {}) => {
  const cache = new Map();
  const gitAvailable = execFileAsync(
    gitBinary,
    ["rev-parse", "--is-inside-work-tree"],
    { cwd }
  )
    .then(({ stdout }) => stdout.trim() === "true")
    .catch(() => false);

  const gitLastModified = async (filePath) => {
    if (!(await gitAvailable)) {
      return null;
    }
    try {
      const { stdout } = await execFileAsync(
        gitBinary,
        ["log", "-1", "--pretty=%aI", "--", path.relative(cwd, filePath)],
        { cwd }
      );
      const date = new Date(stdout.trim());
      return Number.isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  return (filePath) => {
    const cached = cache.get(filePath);
    if (cached) {
      return cached;
    }

    const result = readFrontmatterLastModified(filePath).then(
      (fromFrontmatter) => fromFrontmatter ?? gitLastModified(filePath)
    );
    cache.set(filePath, result);
    return result;
  };
};

const getLastModified = createLastModified();

export const geistShikiTheme = {
  name: "geist",
  type: "dark",
  colors: {
    "editor.foreground": "var(--shiki-color-text, inherit)",
    "editor.background": "var(--shiki-color-background, transparent)",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "var(--shiki-token-comment)" },
    },
    {
      scope: [
        "constant",
        "entity.name.constant",
        "variable.other.constant",
        "variable.other.enummember",
        "variable.language",
        "entity",
      ],
      settings: { foreground: "var(--shiki-token-constant)" },
    },
    {
      scope: ["entity.name", "meta.export.default", "meta.definition.variable"],
      settings: { foreground: "var(--shiki-token-function)" },
    },
    {
      scope: [
        "variable.parameter.function",
        "meta.jsx.children",
        "meta.block",
        "meta.tag.attributes",
        "entity.name.section",
        "text",
        "punctuation.definition.tag",
        "punctuation.separator.inheritance.php",
        "punctuation.definition.tag.html",
        "punctuation.definition.tag.begin.html",
        "punctuation.definition.tag.end.html",
        "punctuation.section.embedded",
        "variable.parameter",
      ],
      settings: { foreground: "var(--shiki-token-parameter)" },
    },
    {
      scope: ["entity.name.tag", "support.class.component"],
      settings: { foreground: "var(--shiki-token-function)" },
    },
    {
      scope: "keyword",
      settings: { foreground: "var(--shiki-token-keyword)" },
    },
    {
      scope: ["storage", "storage.type", "storage.modifier"],
      settings: { foreground: "var(--shiki-token-keyword)" },
    },
    {
      scope: [
        "string",
        "string punctuation.section.embedded source",
        "attribute.value",
      ],
      settings: { foreground: "var(--shiki-token-string)" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition.string",
        "punctuation.definition.variable",
        "punctuation.definition.string.begin",
        "punctuation.definition.string.end",
        "punctuation.section.embedded.begin",
        "punctuation.section.embedded.end",
      ],
      settings: { foreground: "var(--shiki-token-punctuation)" },
    },
    {
      scope: "string.regexp",
      settings: { foreground: "var(--shiki-token-string-expression)" },
    },
    {
      scope: [
        "support.function",
        "entity.name.function",
        "meta.function-call.generic",
      ],
      settings: { foreground: "var(--shiki-token-function)" },
    },
    {
      scope: "markup.underline.link",
      settings: { foreground: "var(--shiki-token-link)" },
    },
    {
      scope: [
        "markup.list",
        "string.other.link.title.markdown",
        "string.other.link.description.markdown",
      ],
      settings: { foreground: "var(--shiki-token-parameter)" },
    },
  ],
};

export const aiDocsFrontmatterSchema = frontmatterSchema.extend({
  badge: z.string().optional(),
  product: z.string().optional(),
  navTitle: z.string().optional(),
  url: z
    .string()
    .regex(/^\/.*/, { message: "url must start with a slash" })
    .optional(),
  type: z
    .enum([
      "conceptual",
      "guide",
      "reference",
      "troubleshooting",
      "integration",
      "overview",
    ])
    .optional(),
  prerequisites: z
    .array(
      z.string().regex(/^\/.*/, {
        message: "prerequisites must start with a slash",
      })
    )
    .optional(),
  related: z
    .array(
      z.string().regex(/^\/.*/, { message: "related must start with a slash" })
    )
    .optional(),
  summary: z.string().optional(),
  lastModified: z.coerce.date().optional(),
  internal: z.boolean().optional(),
  noindex: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  canonical: z.string().optional(),
  excludeFrom: z
    .array(z.enum(["chat", "llms", "search", "sitemap"]))
    .optional(),
});

export const aiDocsMetaSchema = metaSchema;

export const defineAiDocsSourceConfig = (config = {}) => {
  const existingRemarkPlugins = Array.isArray(config.mdxOptions?.remarkPlugins)
    ? config.mdxOptions.remarkPlugins
    : [];
  const existingPlugins = Array.isArray(config.plugins) ? config.plugins : [];

  return defineFumadocsConfig({
    ...config,
    mdxOptions: {
      ...config.mdxOptions,
      remarkPlugins: [remarkMdxMermaid, ...existingRemarkPlugins],
      rehypeCodeOptions: {
        ...config.mdxOptions?.rehypeCodeOptions,
        themes: { light: geistShikiTheme, dark: geistShikiTheme },
        defaultColor: "light",
      },
    },
    plugins: [
      lastModified({ versionControl: getLastModified }),
      ...existingPlugins,
    ],
  });
};
