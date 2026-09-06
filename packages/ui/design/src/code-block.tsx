'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from './utils';

interface CodeBlockProps {
  lines?: string[];
  title?: string;
  code?: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  lines,
  title,
  code,
  language,
  filename,
  className,
}: CodeBlockProps) {
  const source = lines ?? (code ? code.split('\n') : []);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-alpha-border bg-black/20',
        className,
      )}
    >
      <div className="flex h-8 items-center justify-between border-b border-alpha-border bg-surface-200/60 pl-3 pr-1.5">
        <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {filename ?? title}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {language && (
            <span className="font-mono text-[10px] lowercase text-muted-foreground">
              {language}
            </span>
          )}
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-surface-300 hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <ol className="overflow-x-auto p-3 font-mono text-[12px] leading-6">
        {source.map((line, index) => (
          <li
            key={index}
            className="grid grid-cols-[2ch_1fr] gap-3 whitespace-pre-wrap"
          >
            <span className="select-none text-right text-muted-foreground/60">
              {index + 1}
            </span>
            <span className="min-w-0 text-foreground/90">{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
