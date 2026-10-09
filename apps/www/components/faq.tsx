'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-2xl">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="border-b border-border">
            <button
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left"
            >
              <span className="text-base font-medium tracking-tight text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180 text-foreground',
                )}
              />
            </button>
            {isOpen && (
              <p className="px-1 pb-5 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
