'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Trash2 } from 'lucide-react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
  isLoading: boolean
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
}: PromptInputProps) {
  const [rows, setRows] = useState(4)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const textareaLineHeight = parseInt(
      window.getComputedStyle(e.target).lineHeight
    )
    const newRows = Math.max(
      4,
      Math.ceil((e.target.scrollHeight - 16) / textareaLineHeight)
    )
    setRows(Math.min(newRows, 15))
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your prompt here... (Ctrl+Enter to submit)"
          rows={rows}
          className="w-full px-4 py-3 bg-input-bg border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          variant="secondary"
          onClick={onClear}
          disabled={isLoading || !value}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading || !value}
          className="min-w-24"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Submit
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
