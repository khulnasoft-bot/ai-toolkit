'use client'

import { useState } from 'react'
import { Copy, Download, Loader } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ModelResponse {
  content: string
  tokens: number
  cost: number
  time: number
}

interface ModelCardProps {
  provider: string
  model: string
  response?: ModelResponse
  isLoading: boolean
  error?: string
}

export function ModelCard({
  provider,
  model,
  response,
  isLoading,
  error,
}: ModelCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (response?.content) {
      navigator.clipboard.writeText(response.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (response?.content) {
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(response.content)
      )
      element.setAttribute('download', `${model}-response.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:border-primary/50 transition-colors">
      {/* Header */}
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{provider}</CardTitle>
            <CardDescription className="text-sm mt-1">{model}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Generating response...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="text-4xl">⚠️</div>
            <p className="text-sm text-error">{error}</p>
          </div>
        ) : response ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              <p className="text-foreground whitespace-pre-wrap break-words text-sm leading-relaxed">
                {response.content}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-t border-border pt-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Tokens</p>
                <p className="text-sm font-semibold text-foreground">
                  {response.tokens}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-semibold text-foreground">
                  {response.time.toFixed(2)}s
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Cost</p>
                <p className="text-sm font-semibold text-foreground">
                  ${response.cost.toFixed(5)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              Submit a prompt to see the response
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
