'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Download, Loader } from 'lucide-react'
import { useState } from 'react'

interface ResponseViewerProps {
  response: string
  loading: boolean
  onCopy: () => void
}

export function ResponseViewer({ response, loading, onCopy }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response))
    element.setAttribute('download', 'response.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm">Generating response...</span>
        </div>
      </Card>
    )
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6 text-center text-muted-foreground text-sm py-8">
          Run a prompt to see the response here
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Response</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-hover-bg transition-colors text-muted-foreground hover:text-foreground"
              title="Copy response"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-hover-bg transition-colors text-muted-foreground hover:text-foreground"
              title="Download response"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="bg-input-bg rounded-lg px-4 py-3 text-foreground whitespace-pre-wrap break-words max-h-96 overflow-y-auto font-mono text-sm leading-relaxed">
          {response}
        </div>
      </div>
    </Card>
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
