'use client'

import { Copy } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  onCopy: (code: string) => void
  copied: boolean
}

export function CodeBlock({ code, language = 'typescript', onCopy, copied }: CodeBlockProps) {
  return (
    <div className="bg-input-bg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button
          onClick={() => onCopy(code)}
          className="p-1.5 rounded hover:bg-hover-bg transition-colors text-muted-foreground hover:text-foreground"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </div>
  )
}

function Check({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
