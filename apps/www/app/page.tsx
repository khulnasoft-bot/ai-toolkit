import Link from 'next/link';
import {
  ArrowUpRight,
  Boxes,
  Grid2X2,
  Library,
  Play,
  Sparkles,
  Waypoints,
  Wrench,
} from 'lucide-react';
import { HeroExample } from '@/components/hero-example';
import { CommandRow } from '@/components/command-row';
import { Faq } from '@/components/faq';
import { getAllRecipes } from '@/lib/recipes';
import { gateways } from '@/lib/gateways';
import { resources } from '@/lib/resources';

const stats = [
  { value: '18.3M', label: 'Weekly downloads' },
  { value: '26.3K', label: 'GitHub stars' },
  { value: '695+', label: 'Contributors' },
  { value: '100+', label: 'Models supported' },
];

const providerNames = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Meta',
  'Mistral',
  'xAI',
  'Amazon',
];

const faqs = [
  {
    question: 'What is AI TOOLKIT?',
    answer:
      'AI TOOLKIT is an open-source TypeScript SDK for building AI apps and agents. It gives you one unified interface for streaming, structured output, tools, fallbacks, and multi-model support across every major provider and framework.',
  },
  {
    question: 'How is it different from calling each provider directly?',
    answer:
      'You write against a single API instead of N provider SDKs. Swap models, add structured output, wire in tools, and set up fallbacks without changing your application code.',
  },
  {
    question: 'Which providers and models are supported?',
    answer: `A growing catalog: ${resources.count('recipes')} recipes, ${gateways.length} gateways serving every major lab, and first-party providers for OpenAI, Anthropic, Google, Amazon Bedrock, and more — all browsable in the Providers section.`,
  },
  {
    question: 'Does it work with my framework?',
    answer:
      'Yes. Official frameworks cover React, Next.js, Vue, Svelte, Angular, and RSC, with adapters for LangChain and LlamaIndex. Bring your own prompts, stream into React hooks, or run purely in Node.js.',
  },
  {
    question: 'Is AI TOOLKIT production-ready?',
    answer:
      'Yes. It is Apache-2.0 licensed, powers production applications, and ships with typed errors, request logging, telemetry, and documented load test results for every core primitive.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Install the core package, then start from a recipe or template. The Recipes section is built to copy, paste, and run on any model.',
  },
];

const sections = [
  {
    href: '/resources/recipes',
    icon: Library,
    eyebrow: 'Recipes',
    title: 'Build AI features faster',
    description:
      'Focused MDX recipes with runnable examples. Structured extraction, durable agents, RAG, and more.',
    meta: `${resources.count('recipes')} recipes`,
  },
  {
    href: '/resources/tools',
    icon: Wrench,
    eyebrow: 'Tools Registry',
    title: 'Give your agent superpowers',
    description:
      'Community-built tools that add web search, extraction, code execution, and more. Install, define a schema, ship.',
    meta: `${resources.count('tools')} tools`,
  },
  {
    href: '/gateways',
    icon: Waypoints,
    eyebrow: 'AI Gateways',
    title: 'One API, every model',
    description:
      'Gateways that unify hundreds of models behind a single integration — with routing, fallbacks, caching, and observability.',
    meta: `${gateways.length} gateways`,
  },
  {
    href: '/playground',
    icon: Play,
    eyebrow: 'Playground',
    title: 'Compare models side-by-side',
    description:
      'Tune prompts across models in real time, compare cost and latency, and export production-ready AI Toolkit code.',
    meta: 'Try it on Studio',
  },
  {
    href: '/resources/templates',
    icon: Boxes,
    eyebrow: 'Templates',
    title: 'Start from a real app',
    description:
      'Official app templates, examples, and framework integrations with the right primitives already wired up.',
    meta: `${resources.count('templates')} templates`,
  },
  {
    href: '/resources/showcase',
    icon: Grid2X2,
    eyebrow: 'Showcase',
    title: 'See what people are shipping',
    description:
      'Popular products and projects built with the AI SDK — proof and inspiration for your next build.',
    meta: `${resources.count('showcase')} projects`,
  },
];

const featuredSlugs = [
  { category: 'guides', slug: 'rag-chatbot' },
  { category: 'node', slug: 'call-tools' },
  { category: 'next', slug: 'chat-with-pdf' },
];

export default function Home() {
  const recipes = getAllRecipes();
  const featured = featuredSlugs
    .map(({ category, slug }) =>
      recipes.find(r => r.category === category && r.slug === slug),
    )
    .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6">
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[720px] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl"
        />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="mr-2 size-3.5 text-primary" />
              The AI Toolkit for TypeScript &amp; JavaScript
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-[-.06em] sm:text-6xl lg:text-7xl">
              Universal AI layer for every app
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
              One SDK for building AI features, agents, and apps — with
              streaming, structured output, tools, and fallbacks across every
              major provider.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/resources/recipes"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Browse recipes
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/gateways/models"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-muted"
              >
                Explore models
              </Link>
              <Link
                href="https://studio.khulnasoft.com/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-muted"
              >
                Read the docs
              </Link>
            </div>
            <div className="mt-12">
              <p className="eyebrow">Works with every major provider</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                {providerNames.map(name => (
                  <span
                    key={name}
                    className="text-sm font-semibold tracking-tight text-muted-foreground/70"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <HeroExample />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/20">
        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Explore</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
            Everything you need to ship AI
          </h2>
          <p className="mt-5 text-balance text-base leading-7 text-muted-foreground sm:text-lg">
            Start from a recipe, wire in a tool, or fork a template. Then see
            what the community has built.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {sections.map(section => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground">
                  <section.icon className="size-5" />
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="mt-5 eyebrow">{section.eyebrow}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
              <p className="mt-4 eyebrow">{section.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured recipes */}
      {featured.length > 0 && (
        <section className="pb-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Featured recipes</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                Build with AI TOOLKIT today
              </h2>
            </div>
            <Link
              href="/resources/recipes"
              className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:flex"
            >
              View all recipes <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featured.map(recipe => (
              <Link
                key={`${recipe.category}-${recipe.slug}`}
                href={`/resources/recipes/${recipe.category}/${recipe.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{recipe.categoryTitle}</span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {recipe.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                  {recipe.description}
                </p>
                <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{recipe.readTime} min</span>
                  {recipe.tags.slice(0, 2).map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Everything you need to know before you start building.
          </p>
        </div>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </section>

      {/* Install CTA */}
      <section className="mb-20 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Build with AI TOOLKIT today
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Get started with the AI TOOLKIT by using our recipes or templates,
              or install the core package in seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/resources/recipes"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Browse recipes <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/resources/templates"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-muted"
              >
                View templates
              </Link>
            </div>
          </div>
          <InstallCommand />
        </div>
      </section>
    </div>
  );
}

function InstallCommand() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm">
        <p className="mb-2 eyebrow">Install</p>
        <CommandRow command="npm install ai" />
      </div>
    </div>
  );
}
