'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModelSelectorProps {
  selectedModels: { provider: string; model: string }[]
  onAdd: () => void
  onRemove: (index: number) => void
  maxModels?: number
}

const AVAILABLE_PROVIDERS = [
  {
    name: 'OpenAI',
    models: [
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-4-vision',
      'gpt-4-1106-preview',
    ],
  },
  {
    name: 'Anthropic',
    models: [
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-3-haiku',
      'claude-2.1',
      'claude-2',
    ],
  },
  {
    name: 'Groq',
    models: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
  },
  {
    name: 'Google',
    models: ['gemini-pro', 'gemini-pro-vision', 'palm-2'],
  },
  {
    name: 'Mistral',
    models: ['mistral-large', 'mistral-medium', 'mistral-small'],
  },
  {
    name: 'Cohere',
    models: ['command-r-plus', 'command-r', 'command-nightly'],
  },
]

export function ModelSelector({
  selectedModels,
  onAdd,
  onRemove,
  maxModels = 4,
}: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Selected Models ({selectedModels.length}/{maxModels})
        </h3>
        {selectedModels.length < maxModels && (
          <Button variant="secondary" size="sm" onClick={onAdd}>
            + Add Model
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {selectedModels.map((selected, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-input-bg border border-border rounded-lg px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {selected.provider}
              </p>
              <p className="text-xs text-muted-foreground">{selected.model}</p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-muted-foreground hover:text-error transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedModels.length === 0 && (
        <div className="bg-input-bg border border-border rounded-lg px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No models selected. Click "Add Model" to get started.
          </p>
        </div>
      )}
    </div>
  )
}
