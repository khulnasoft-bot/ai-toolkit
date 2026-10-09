import Link from 'next/link';
import {
  ArrowUpRight,
  Braces,
  Code2,
  Cpu,
  GitCompare,
  Lightbulb,
  Play,
  Zap,
} from 'lucide-react';
import { PlaygroundCompare } from '@/components/playground-compare';
import { SectionHeader } from '@/components/section-header';
import {
  PLAYGROUND_URL,
  playgroundFeatures,
  playgroundProviders,
  samplePrompts,
} from '@/lib/playground';

export const metadata = {
  title: 'AI Playground',
};

const featureIcons = {
  compare: GitCompare,
  stream: Zap,
  code: Code2,
  prompts: Lightbulb,
  export: Braces,
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <SectionHeader
        eyebrow="AI Playground"
        title="Compare every model, side-by-side."
        description="Tune prompts across models in real time. Stream responses, compare cost and latency, then export production-ready AI Toolkit code."
      />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={PLAYGROUND_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Play className="size-4" />
          Open the playground
        </Link>
        <Link
          href="https://studio.khulnasoft.com/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-alpha-border-strong px-4 py-2.5 text-sm text-foreground hover:bg-surface-200"
        >
          Read the docs
        </Link>
      </div>

      {/* Compare preview */}
      <div className="mt-14">
        <PlaygroundCompare />
      </div>

      {/* Features */}
      <section className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Features</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
            Everything you need to pick the right model
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {playgroundFeatures.map(feature => {
            const Icon = featureIcons[feature.id as keyof typeof featureIcons];
            return (
              <div
                key={feature.id}
                className="rounded-xl border border-alpha-border bg-surface-100 p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-surface-200 text-muted-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
          <Link
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-dashed border-alpha-border-strong bg-surface-100 p-6 transition-colors hover:border-foreground/25"
          >
            <p className="text-base font-semibold tracking-tight">
              And more, on Studio
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
              Try it now
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </p>
          </Link>
        </div>
      </section>

      {/* Providers */}
      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Providers</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              One prompt, every provider
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              Test leading frontier and open-source models against each other,
              without wiring up a single API key by hand.
            </p>
          </div>
          <div className="hidden items-center gap-1.5 eyebrow sm:flex">
            <Cpu className="size-4" />
            {playgroundProviders.length} providers
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playgroundProviders.map(provider => (
            <div
              key={provider.name}
              className="rounded-xl border border-alpha-border bg-surface-100 p-5"
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {provider.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-primary">
                {provider.models}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {provider.capabilities.map(capability => (
                  <span
                    key={capability}
                    className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample prompts */}
      <section className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Sample prompts</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
            Start from a question, not a blank box
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Pre-built examples cover the everyday tasks you will tune and
            compare in the playground.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {samplePrompts.map(prompt => (
            <div
              key={prompt.title}
              className="rounded-xl border border-alpha-border bg-surface-100 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow">{prompt.title}</span>
                <Lightbulb className="size-3.5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground/90">
                “{prompt.prompt}”
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 overflow-hidden rounded-2xl border border-alpha-border-strong bg-gradient-to-b from-surface-200/60 to-surface-100">
        <div className="flex flex-col items-center gap-6 p-8 text-center lg:p-12">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Find your model in minutes
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              No downloads or setup. Open the AI Playground, compare responses
              across models, and export code that runs in your app.
            </p>
          </div>
          <Link
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Play className="size-4" />
            Open the playground
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
