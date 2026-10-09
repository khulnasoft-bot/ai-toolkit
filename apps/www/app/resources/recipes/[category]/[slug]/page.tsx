import { notFound } from 'next/navigation';
import { ArrowUpRight, BookOpen, Clock, Github } from 'lucide-react';
import { CodeBlock } from '@ai-toolkit/design/code-block';
import { CommandRow } from '@/components/command-row';
import { InlineText } from '@/components/inline-text';
import { getRecipe, getAllRecipePaths } from '@/lib/recipes';

export function generateStaticParams() {
  return getAllRecipePaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const recipe = getRecipe(category, slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const recipe = getRecipe(category, slug);
  if (!recipe) notFound();

  const hasCode =
    recipe.sections.some(section => section.codeBlocks.length > 0) ||
    recipe.introCodeBlocks.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <a href="/resources/recipes" className="hover:text-foreground">
            Recipes
          </a>
          <span>/</span>
          <a
            href={`/resources/recipes?category=${recipe.category}`}
            className="hover:text-foreground"
          >
            {recipe.categoryTitle}
          </a>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {recipe.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {recipe.readTime} min read
          </span>
          {recipe.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
          <a
            href={recipe.sourcePath}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <Github className="size-3.5" />
            View source
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>

      <div className="my-10 border-t border-border" />

      {/* Body */}
      {recipe.intro && (
        <div className="mb-10 space-y-4">
          {recipe.intro.split('\n').map((line, index) => (
            <InlineText key={index} text={line} />
          ))}
          {recipe.introCodeBlocks.length > 0 && (
            <div className="space-y-4 pt-2">
              {recipe.introCodeBlocks.map((block, index) => (
                <CodeBlock
                  key={`intro-${index}`}
                  code={block.code}
                  language={block.language}
                  filename={block.filename}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {hasCode && (
        <div className="mb-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Run it locally
          </p>
          <CommandRow command="npm install ai" />
        </div>
      )}

      <div className="space-y-12">
        {recipe.sections.map(section => (
          <section key={section.heading}>
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <BookOpen className="size-4 text-primary" />
              {section.heading}
            </h2>
            {section.content.length > 0 && (
              <div className="mt-4 space-y-4">
                {section.content
                  .filter(line => line.trim() !== '')
                  .map((line, index) => (
                    <InlineText key={index} text={line} />
                  ))}
              </div>
            )}
            {section.codeBlocks.length > 0 && (
              <div className="mt-4 space-y-4">
                {section.codeBlocks.map((block, index) => (
                  <CodeBlock
                    key={`${section.heading}-${index}`}
                    code={block.code}
                    language={block.language}
                    filename={block.filename}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related */}
      <div className="mt-16 border-t border-border pt-8">
        <a
          href="/resources/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Browse all recipes
        </a>
      </div>
    </div>
  );
}
