'use client';

import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Github,
  Grid2X2,
  History,
  Layers3,
  Library,
  Link2,
  Menu,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ChatInterface } from '@/components/chat-interface';
import {
  clearSessions,
  clearTranscripts,
  createSession,
  deleteSession,
  loadSessions,
  transcriptKey,
  type PlaygroundSession,
} from '@/lib/history';
import { aiProviders, allModels, DEFAULT_MODEL } from '@/lib/providers';

type Section =
  | 'Playground'
  | 'Recipes'
  | 'Tools Registry'
  | 'Templates'
  | 'Showcase'
  | 'Providers';

const sections: { label: Section; icon: typeof Sparkles; count?: string }[] = [
  { label: 'Playground', icon: Sparkles },
  { label: 'Recipes', icon: Library, count: '24' },
  { label: 'Tools Registry', icon: Wrench, count: '48' },
  { label: 'Templates', icon: Boxes, count: '18' },
  { label: 'Showcase', icon: Grid2X2, count: '96' },
  { label: 'Providers', icon: Layers3, count: '32' },
];

const providerColor: Record<string, string> = {
  openai: 'bg-emerald-400',
  anthropic: 'bg-orange-400',
  google: 'bg-blue-400',
  groq: 'bg-cyan-400',
  mistral: 'bg-amber-400',
  xai: 'bg-zinc-400',
  deepseek: 'bg-violet-400',
  cohere: 'bg-pink-400',
  perplexity: 'bg-teal-400',
};

function shortName(modelId: string) {
  return modelId.split('/').pop() ?? modelId;
}

function providerOf(modelId: string) {
  return aiProviders.find(p => p.models.includes(modelId))?.name ?? 'Gateway';
}

function colorOf(modelId: string) {
  const provider = aiProviders.find(p => p.models.includes(modelId));
  return provider ? (providerColor[provider.id] ?? 'bg-primary') : 'bg-primary';
}

const catalog: Record<
  Exclude<Section, 'Playground'>,
  {
    eyebrow: string;
    title: string;
    description: string;
    cards: { title: string; description: string; tag: string; meta: string }[];
  }
> = {
  Recipes: {
    eyebrow: 'OPEN-SOURCE RECIPES',
    title: 'Build specific AI features faster.',
    description:
      'Production-ready patterns for common AI Toolkit use cases, from structured extraction to durable agents.',
    cards: [
      {
        title: 'RAG with reranking',
        description:
          'Search, rerank, and stream grounded answers with citations.',
        tag: 'RAG',
        meta: 'Next.js · 12 min',
      },
      {
        title: 'Structured data extraction',
        description: 'Turn messy documents into typed, validated objects.',
        tag: 'GENERATE OBJECT',
        meta: 'TypeScript · 8 min',
      },
      {
        title: 'Human in the loop',
        description: 'Pause tool calls and resume when a teammate approves.',
        tag: 'AGENTS',
        meta: 'Workflow · 14 min',
      },
    ],
  },
  'Tools Registry': {
    eyebrow: 'COMMUNITY REGISTRY',
    title: 'Give your agent superpowers.',
    description:
      'Drop-in tools for web search, extraction, code execution, and more. Install a tool, define a schema, ship.',
    cards: [
      {
        title: 'Web search',
        description: 'Search the web and return sourced, relevant results.',
        tag: 'SEARCH',
        meta: 'npm install · 4.2k',
      },
      {
        title: 'Exa research',
        description: 'Find and synthesize high-quality research in one call.',
        tag: 'RESEARCH',
        meta: 'npm install · 2.8k',
      },
      {
        title: 'Browser automation',
        description: 'Let agents navigate pages and complete workflows.',
        tag: 'BROWSER',
        meta: 'npm install · 1.9k',
      },
    ],
  },
  Templates: {
    eyebrow: 'START BUILDING',
    title: 'The fastest path from idea to AI app.',
    description:
      'Official templates and framework integrations with the right primitives already wired up.',
    cards: [
      {
        title: 'Next.js AI Chatbot',
        description: 'A full-featured chat app with persistence and auth.',
        tag: 'NEXT.JS',
        meta: 'TypeScript · 8.4k',
      },
      {
        title: 'AI SDK Starter',
        description: 'Minimal starter for text, objects, tools, and streaming.',
        tag: 'STARTER',
        meta: 'TypeScript · 3.1k',
      },
      {
        title: 'Generative UI',
        description: 'Render rich React components from model tool calls.',
        tag: 'REACT',
        meta: 'Next.js · 2.2k',
      },
    ],
  },
  Showcase: {
    eyebrow: 'BUILT WITH AI TOOLKIT',
    title: 'See what people are shipping.',
    description:
      'Popular products and projects from the community, all built on the same flexible primitives.',
    cards: [
      {
        title: 'Dub',
        description: 'The modern link management platform with AI workflows.',
        tag: 'PLATFORM',
        meta: 'Featured',
      },
      {
        title: 'Cal.com Agent',
        description: 'Schedule meetings through a conversational interface.',
        tag: 'AGENT',
        meta: 'Featured',
      },
      {
        title: 'Replit Agent',
        description:
          'Turn ideas into software with an autonomous coding agent.',
        tag: 'CODING',
        meta: 'Featured',
      },
    ],
  },
  Providers: {
    eyebrow: 'MODEL PROVIDERS',
    title: 'One toolkit. Every model.',
    description:
      'Use the provider that fits your application, or route through AI Gateway for one API key and automatic fallbacks.',
    cards: [
      {
        title: 'AI Gateway',
        description: 'Hundreds of models from one unified API with no markup.',
        tag: 'VERCEL',
        meta: 'Gateway · 100+ models',
      },
      {
        title: 'Anthropic',
        description: 'Claude models for reasoning, writing, and coding.',
        tag: 'PROVIDER',
        meta: 'Direct provider',
      },
      {
        title: 'OpenAI',
        description: 'GPT models with text, vision, and structured outputs.',
        tag: 'PROVIDER',
        meta: 'Direct provider',
      },
    ],
  },
};

function SelectBox({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-muted-foreground" />
    </div>
  );
}

function ComparePane({
  index,
  modelId,
  setModelId,
  onRemove,
  canRemove,
  broadcast,
  temperature,
  maxOutputTokens,
  system,
  persistKey,
}: {
  index: number;
  modelId: string;
  setModelId: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  broadcast: { text: string; nonce: number } | null;
  temperature: number;
  maxOutputTokens: number;
  system?: string;
  persistKey: string;
}) {
  return (
    <div className="flex min-h-[560px] flex-col border-b border-border lg:border-b-0 lg:border-r last:border-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            MODEL {index + 1}
          </span>
          <span className={`size-2 rounded-full ${colorOf(modelId)}`} />
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 hidden font-mono text-[10px] text-muted-foreground sm:inline">
            {providerOf(modelId)}
          </span>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Remove model ${index + 1}`}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <SelectBox value={modelId} onChange={setModelId}>
          {aiProviders.map(provider => (
            <optgroup key={provider.id} label={provider.name}>
              {provider.models.map(id => (
                <option value={id} key={id}>
                  {shortName(id)}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectBox>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{providerOf(modelId)}</span>
          <span>
            <b className="font-mono text-foreground">
              {temperature.toFixed(1)}
            </b>
            {' · '}
            <b className="font-mono text-foreground">{maxOutputTokens}</b> tok
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4">
        <ChatInterface
          modelId={modelId}
          temperature={temperature}
          maxOutputTokens={maxOutputTokens}
          system={system || undefined}
          broadcast={broadcast}
          persistKey={persistKey}
          compact
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [active, setActive] = useState<Section>('Playground');
  const [mobileNav, setMobileNav] = useState(false);
  const [panes, setPanes] = useState<string[]>([
    DEFAULT_MODEL,
    allModels[3] ?? allModels[0],
  ]);
  const [prompt, setPrompt] = useState(
    'Explain how streaming responses work in the AI SDK.',
  );
  const [broadcast, setBroadcast] = useState<{
    text: string;
    nonce: number;
  } | null>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [system, setSystem] = useState('');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [sessions, setSessions] = useState<PlaygroundSession[]>([]);
  const [chatEpoch, setChatEpoch] = useState(0);

  // Init from shareable URL (?models=a,b&prompt=...&temp=0.7&max=1024&sys=...)
  // + local history.
  useEffect(() => {
    setSessions(loadSessions());
    try {
      const params = new URLSearchParams(window.location.search);
      const modelsParam = params.get('models');
      const promptParam = params.get('prompt');
      const tempParam = params.get('temp');
      const maxParam = params.get('max');
      const sysParam = params.get('sys');
      if (modelsParam) {
        const ids = modelsParam
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        if (ids.length > 0) setPanes(ids.slice(0, 4));
      }
      if (promptParam) setPrompt(promptParam);
      if (tempParam) {
        const t = Number(tempParam);
        if (Number.isFinite(t)) setTemperature(Math.min(2, Math.max(0, t)));
      }
      if (maxParam) {
        const m = Number(maxParam);
        if (Number.isFinite(m))
          setMaxTokens(Math.min(8192, Math.max(64, Math.round(m))));
      }
      if (sysParam) setSystem(sysParam.slice(0, 2000));
    } catch {
      // ignore malformed URLs
    }
  }, []);

  // Keep URL shareable without navigating.
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      params.set('models', panes.join(','));
      if (prompt.trim()) params.set('prompt', prompt.trim().slice(0, 500));
      params.set('temp', temperature.toFixed(1));
      params.set('max', String(maxTokens));
      if (system.trim()) params.set('sys', system.trim().slice(0, 500));
      window.history.replaceState(null, '', `?${params.toString()}`);
    } catch {
      // ignore (SSR / restricted context)
    }
  }, [panes, prompt, temperature, maxTokens, system]);

  const filteredCards = useMemo(
    () =>
      active === 'Playground'
        ? []
        : catalog[active].cards.filter(card =>
            `${card.title} ${card.description} ${card.tag}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
    [active, query],
  );
  const runPrompt = () => {
    if (!prompt.trim()) return;
    setBroadcast({ text: prompt.trim(), nonce: Date.now() });
    setSessions(prev => {
      const latest = prev[0];
      if (
        latest &&
        latest.prompt === prompt.trim() &&
        latest.models.join(',') === panes.join(',') &&
        Date.now() - latest.updatedAt < 30_000
      ) {
        return prev;
      }
      return [
        createSession({
          prompt: prompt.trim(),
          models: panes,
          temperature,
          system: system.trim() || undefined,
          maxOutputTokens: maxTokens,
        }),
        ...prev,
      ].slice(0, 30);
    });
  };
  const newSession = () => {
    clearTranscripts(panes.length);
    setPanes([DEFAULT_MODEL, allModels[3] ?? allModels[0]]);
    setPrompt('');
    setBroadcast(null);
    setTemperature(0.7);
    setMaxTokens(1024);
    setSystem('');
    setChatEpoch(e => e + 1);
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      // ignore
    }
  };
  const restoreSession = (session: PlaygroundSession) => {
    clearTranscripts(panes.length);
    setPanes(session.models.slice(0, 4));
    setPrompt(session.prompt);
    setTemperature(session.temperature);
    setMaxTokens(session.maxOutputTokens ?? 1024);
    setSystem(session.system ?? '');
    setBroadcast(null);
    setChatEpoch(e => e + 1);
    setMobileNav(false);
  };
  const addPane = () => {
    if (panes.length >= 4) return;
    const unused = allModels.find(m => !panes.includes(m)) ?? DEFAULT_MODEL;
    setPanes([...panes, unused]);
  };
  const copyCode = async () => {
    await navigator.clipboard?.writeText(
      `import { streamText } from '@ai-toolkit/ai'\n\nconst result = streamText({\n  model: '${panes[0] ?? DEFAULT_MODEL}',\n  prompt,\n})`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1600);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav(!mobileNav)}
              className="rounded-md p-2 hover:bg-muted lg:hidden"
            >
              {mobileNav ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
            <a
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              AI TOOLKIT
            </a>
            <span className="hidden border-l border-border pl-3 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground sm:inline">
              Playground
            </span>
          </div>
          <div className="hidden items-center gap-5 text-xs text-muted-foreground md:flex">
            <a
              href="https://studio.khulnasoft.com/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Docs
            </a>
            <a
              href="https://github.com/khulnasoft/ai-toolkit"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
            <a href="/recover" className="hover:text-foreground">
              Recover data
            </a>
            <a
              href="https://discord.gg/khulnasoft"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Discord
            </a>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-foreground hover:bg-muted"
            >
              Sign in
            </button>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
          >
            <Github className="size-4" />
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside
          className={`${mobileNav ? 'block' : 'hidden'} fixed inset-x-0 top-14 z-10 min-h-[calc(100vh-3.5rem)] border-r border-border bg-background p-4 lg:static lg:block lg:min-h-[calc(100vh-3.5rem)] lg:w-60 lg:shrink-0`}
        >
          <div className="mb-5 flex items-center justify-between px-2">
            <span className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
              Explore
            </span>
            <Search className="size-3.5 text-muted-foreground" />
          </div>
          <nav className="flex flex-col gap-1">
            {sections.map(({ label, icon: Icon, count }) => (
              <button
                type="button"
                key={label}
                onClick={() => {
                  setActive(label);
                  setMobileNav(false);
                }}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-left text-sm ${active === label ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={
                      active === label ? 'size-4 text-primary' : 'size-4'
                    }
                  />
                  {label}
                </span>
                {count && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-3 flex items-center justify-between px-3">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
                History
              </p>
              {sessions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSessions(clearSessions())}
                  className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={newSession}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <Plus className="size-4" />
              New session
            </button>
            {sessions.length === 0 ? (
              <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">
                Runs are saved in this browser. Sign-in sync comes later.
              </p>
            ) : (
              <div className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="group flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-muted/60"
                  >
                    <button
                      type="button"
                      onClick={() => restoreSession(session)}
                      className="min-w-0 flex-1 rounded-md px-2 py-2 text-left"
                      title={session.prompt}
                    >
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <History className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{session.title}</span>
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                        {session.models.length} models ·{' '}
                        {session.temperature.toFixed(1)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessions(deleteSession(session.id))}
                      className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
                      aria-label="Delete session"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 rounded-md border border-border bg-muted/30 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
              AI GATEWAY
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Hundreds of models. One API key. No markup.
            </p>
            <button
              type="button"
              className="mt-3 flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary"
            >
              Learn more <ArrowUpRight className="size-3" />
            </button>
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-4 py-7 lg:px-8 lg:py-10">
          {active === 'Playground' ? (
            <>
              <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">
                    COMPARE MODELS
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                    Playground
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Experiment with models, prompts, and settings before you
                    write a line of production code.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"
                  >
                    <BookOpen className="size-3.5" /> Docs
                  </button>
                  <button
                    type="button"
                    onClick={addPane}
                    disabled={panes.length >= 4}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    <Plus className="size-3.5" /> Add model ({panes.length}/4)
                  </button>
                </div>
              </div>
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                <span className="flex size-5 items-center justify-center rounded bg-primary/15 text-primary">
                  <ZapIcon />
                </span>
                <span>
                  <b className="text-foreground">AI Gateway</b> gives you access
                  to 100+ models from one API key.
                </span>
                <a
                  href="https://studio.khulnasoft.com/docs/ai-sdk-core/providers-and-models"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-1 font-medium text-foreground hover:text-primary"
                >
                  Explore providers <ArrowUpRight className="size-3" />
                </a>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Untitled comparison
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {linkCopied ? (
                        <Check className="size-3.5 text-primary" />
                      ) : (
                        <Link2 className="size-3.5" />
                      )}
                      {linkCopied ? 'Link copied' : 'Copy link'}
                    </button>
                    <button
                      type="button"
                      onClick={copyCode}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-primary" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied ? 'Copied' : 'Copy code'}
                    </button>
                  </div>
                </div>
                <div
                  className={`grid ${panes.length > 2 ? 'lg:grid-cols-2 xl:grid-cols-2' : 'lg:grid-cols-2'}`}
                >
                  {panes.map((modelId, index) => (
                    <ComparePane
                      key={`${chatEpoch}-${index}`}
                      index={index}
                      modelId={modelId}
                      setModelId={value =>
                        setPanes(items =>
                          items.map((item, i) => (i === index ? value : item)),
                        )
                      }
                      onRemove={() =>
                        setPanes(items => items.filter((_, i) => i !== index))
                      }
                      canRemove={panes.length > 1}
                      broadcast={broadcast}
                      temperature={temperature}
                      maxOutputTokens={maxTokens}
                      system={system}
                      persistKey={transcriptKey(index)}
                    />
                  ))}
                </div>
                <div className="border-t border-border bg-muted/20 p-4">
                  <details className="mb-3">
                    <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      System prompt{system.trim() ? ' · set' : ' (optional)'}
                    </summary>
                    <textarea
                      value={system}
                      onChange={event => setSystem(event.target.value)}
                      rows={2}
                      className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground"
                      placeholder="e.g. You are a concise senior engineer. Answer in bullet points."
                    />
                  </details>
                  <textarea
                    value={prompt}
                    onChange={event => setPrompt(event.target.value)}
                    onKeyDown={event => {
                      if (
                        (event.metaKey || event.ctrlKey) &&
                        event.key === 'Enter'
                      ) {
                        event.preventDefault();
                        runPrompt();
                      }
                    }}
                    rows={3}
                    className="w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
                    placeholder="Ask all models anything... (⌘↵ to run)"
                  />
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <label className="flex items-center gap-2">
                        Temperature
                        <input
                          type="range"
                          min={0}
                          max={2}
                          step={0.1}
                          value={temperature}
                          onChange={event =>
                            setTemperature(Number(event.target.value))
                          }
                          className="w-24"
                        />
                        <b className="font-mono text-foreground">
                          {temperature.toFixed(1)}
                        </b>
                      </label>
                      <label className="flex items-center gap-2">
                        Max tokens
                        <input
                          type="number"
                          min={64}
                          max={8192}
                          step={64}
                          value={maxTokens}
                          onChange={event => {
                            const v = Number(event.target.value);
                            if (Number.isFinite(v))
                              setMaxTokens(
                                Math.min(8192, Math.max(64, Math.round(v))),
                              );
                          }}
                          className="w-20 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs outline-none"
                        />
                      </label>
                      <span className="hidden font-mono text-[10px] sm:inline">
                        ⌘ ↵ to run
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={runPrompt}
                      disabled={!prompt.trim()}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
                    >
                      Run prompt
                      <Play className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border border-border p-4">
                  <Code2 className="size-4 text-primary" />
                  <p className="mt-4 text-sm font-medium">
                    Write less glue code
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    One API for every provider, with typed primitives for your
                    app.
                  </p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <Wrench className="size-4 text-primary" />
                  <p className="mt-4 text-sm font-medium">
                    Tools that just work
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Give your agents capabilities with a few lines of code.
                  </p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <Layers3 className="size-4 text-primary" />
                  <p className="mt-4 text-sm font-medium">
                    Ship with confidence
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Start from recipes and templates built by the community.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">
                    {catalog[active].eyebrow}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                    {catalog[active].title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {catalog[active].description}
                  </p>
                </div>
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder={`Search ${active.toLowerCase()}...`}
                    className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCards.map(card => (
                  <article
                    key={card.title}
                    className="group flex min-h-52 flex-col rounded-lg border border-border bg-card p-5 hover:border-primary/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-primary">
                        {card.tag}
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <h2 className="mt-8 text-lg font-medium tracking-tight">
                      {card.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                    <div className="mt-5 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {card.meta}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ZapIcon() {
  return <span className="text-[10px]">↯</span>;
}
