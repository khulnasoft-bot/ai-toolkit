'use client';

import { Check, Copy, Play } from 'lucide-react';
import { useState } from 'react';

const examples = [
  {
    label: 'generate-text.ts',
    language: 'typescript',
    code: `import { generateText } from 'ai-toolkit';

const { text } = await generateText({
  model: 'openai/gpt-4o',
  prompt: 'Explain the concept of quantum entanglement.',
});

console.log(text);`,
  },
  {
    label: 'stream-text.ts',
    language: 'typescript',
    code: `import { streamText } from 'ai-toolkit';

const result = streamText({
  model: 'anthropic/claude-3-5-sonnet',
  prompt: 'Write a short poem about streams.',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}`,
  },
  {
    label: 'generate-object.ts',
    language: 'typescript',
    code: `import { generateObject } from 'ai-toolkit';
import { z } from 'zod';

const { object } = await generateObject({
  model: 'openai/gpt-4o',
  schema: z.object({
    recipe: z.string(),
    ingredients: z.array(z.string()),
  }),
  prompt: 'A simple pasta dish.',
});

console.log(object);`,
  },
  {
    label: 'call-tools.ts',
    language: 'typescript',
    code: `import { generateText, tool } from 'ai-toolkit';
import { z } from 'zod';

const { text } = await generateText({
  model: 'openai/gpt-4o',
  tools: {
    getWeather: tool({
      description: 'Get the weather for a location',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 24, city }),
    }),
  },
  prompt: 'What is the weather in Paris?',
});`,
  },
];

export function HeroExample() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(false);

  const example = examples[active];

  const copy = async () => {
    await navigator.clipboard?.writeText(example.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const run = () => {
    setResult(true);
    window.setTimeout(() => setResult(false), 2500);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-destructive/60" />
            <span className="size-2 rounded-full bg-yellow-500/60" />
            <span className="size-2 rounded-full bg-green-500/60" />
          </span>
          <div className="flex items-center gap-1">
            {examples.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setActive(index)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] ${
                  index === active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={run}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Play className="size-3.5" /> Run
          </button>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3.5 text-primary" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto bg-background/40 p-5 text-[13px] leading-6 text-foreground/90">
        <code>{example.code}</code>
      </pre>
      <div className="border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        {result ? (
          <span className="inline-flex items-center gap-2 text-primary">
            <Play className="size-3" />
            Streaming response... rendering tokens as they arrive.
          </span>
        ) : (
          'Copy this recipe and run it locally — or explore the full recipe below.'
        )}
      </div>
    </div>
  );
}
