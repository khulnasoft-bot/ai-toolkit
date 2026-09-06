'use client';

import { Braces, Feather, History, Plus, Sparkles, Timer } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '@ai-toolkit/design/code-block';
import { IconButton } from '@ai-toolkit/design/icon-button';
import { cn } from '@/lib/utils';

const comparisons = [
  {
    label: 'Explain',
    icon: Sparkles,
    prompt: 'Explain serverless functions in one paragraph.',
    models: [
      {
        name: 'OpenAI · gpt-4.1',
        latency: '1.2s',
        tokens: '148',
        cost: '$0.004',
        response:
          'A serverless function runs your code on demand without you managing servers. The platform provisions compute per request, scales to zero, and bills only for execution time and resources used. You deploy code, the platform handles infrastructure, and cold starts are the main trade-off for latency-sensitive workloads.',
      },
      {
        name: 'Anthropic · claude-4-sonnet',
        latency: '0.9s',
        tokens: '132',
        cost: '$0.009',
        response:
          'Serverless functions execute a single unit of logic in response to events, abstracting away the server entirely. The provider allocates resources purely per invocation — scaling up, down, and to zero automatically. You pay for what you use, and idle capacity costs nothing.',
      },
    ],
  },
  {
    label: 'Extract',
    icon: Braces,
    prompt:
      'Extract JSON with the fields city, summary, and temperature from: "Sunny in Paris today, 24 degrees."',
    models: [
      {
        name: 'OpenAI · gpt-4.1',
        latency: '1.5s',
        tokens: '96',
        cost: '$0.003',
        response:
          '{"city": "Paris", "summary": "Sunny in Paris today", "temperature": 24}',
      },
      {
        name: 'Anthropic · claude-4-sonnet',
        latency: '1.1s',
        tokens: '110',
        cost: '$0.008',
        response:
          '{"city":"Paris","summary":"Sunny skies expected in Paris today","temperature":24}',
      },
    ],
  },
  {
    label: 'Haiku',
    icon: Feather,
    prompt: 'Write a haiku about distributed databases.',
    models: [
      {
        name: 'OpenAI · gpt-4.1',
        latency: '1.8s',
        tokens: '74',
        cost: '$0.002',
        response:
          'shards drift across nodes\nconsistent at last — one view\nquietly agreed',
      },
      {
        name: 'Anthropic · claude-4-sonnet',
        latency: '2.1s',
        tokens: '69',
        cost: '$0.005',
        response:
          'replicas whisper\nacross partitions of glass\nthe quorum agrees',
      },
    ],
  },
];

function isJsonResponse(response: string): boolean {
  return response.trim().startsWith('{');
}

function prettyJsonLines(response: string): string[] {
  const inner = response.trim().slice(1, -1);
  const parts = inner.split(/,\s*(?=")/);
  return ['{', ...parts.map(part => `  ${part.trim()}`), '}'];
}

function responseLines(response: string): string[] {
  if (!isJsonResponse(response)) {
    return response.split('\n');
  }
  return prettyJsonLines(response);
}

export function PlaygroundCompare() {
  const [active, setActive] = useState(0);
  const comparison = comparisons[active];

  return (
    <div className="overflow-hidden rounded-xl border border-alpha-border-strong bg-surface-100">
      {/* Shell title bar */}
      <div className="flex h-12 items-center justify-between border-b border-alpha-border bg-surface-200/80 px-2.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-primary/80" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            AI SDK Playground · Model compare
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton label="New conversation">
            <Plus className="size-3.5" />
          </IconButton>
          <IconButton label="View chat history">
            <History className="size-3.5" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Icon rail */}
        <div className="flex items-center gap-1 border-b border-alpha-border px-2 py-1.5 sm:w-10 sm:flex-col sm:border-b-0 sm:border-r sm:py-2">
          {comparisons.map((item, index) => {
            const Icon = item.icon;
            return (
              <IconButton
                key={item.label}
                label={`${item.label} example`}
                onClick={() => setActive(index)}
                className={cn(
                  'size-8',
                  index === active
                    ? 'bg-surface-200 text-foreground'
                    : 'text-muted-foreground hover:bg-surface-200 hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
              </IconButton>
            );
          })}
        </div>

        <div className="min-w-0 flex-1">
          {/* Prompt bar */}
          <div className="flex items-start gap-3 border-b border-alpha-border bg-background px-4 py-3">
            <span className="eyebrow shrink-0 pt-0.5">Prompt</span>
            <p className="text-sm leading-6 text-foreground/90">
              {comparison.prompt}
            </p>
          </div>

          {/* Model columns */}
          <div className="grid md:grid-cols-2">
            {comparison.models.map((model, index) => {
              const lines = responseLines(model.response);
              return (
                <div
                  key={model.name}
                  className={cn(
                    'flex flex-col',
                    index === 0 && 'md:border-r md:border-alpha-border',
                  )}
                >
                  <div className="flex h-11 items-center justify-between border-b border-alpha-border bg-surface-200/60 px-3">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-foreground">
                      <Sparkles className="size-3 text-primary" />
                      {model.name}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Timer className="size-3" />
                      {model.latency}
                    </span>
                  </div>
                  <div className="flex-1 p-3">
                    {isJsonResponse(model.response) ? (
                      <CodeBlock title="response" lines={lines} />
                    ) : (
                      <p className="text-[13px] leading-6 text-foreground/90">
                        {model.response}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 border-t border-alpha-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{model.tokens} tok</span>
                    <span>{model.cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
