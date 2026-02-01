'use client'

import { Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface HistoryItem {
  id: string
  prompt: string
  timestamp: Date
}

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
}

export function HistoryPanel({
  history,
  onSelect,
  onClear,
}: HistoryPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>History</CardTitle>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-error"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>

      <div className="px-6 pb-6 space-y-2 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No history yet
          </p>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-3 py-2 rounded-lg bg-input-bg hover:bg-hover-bg transition-colors group"
            >
              <p className="text-sm text-foreground line-clamp-2 group-hover:text-primary">
                {item.prompt}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleTimeString()}
              </p>
            </button>
          ))
        )}
      </div>
    </Card>
  )
}
