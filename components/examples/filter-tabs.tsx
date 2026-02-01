'use client'

interface FilterTabsProps {
  label: string
  items: string[]
  selected: string
  onSelect: (item: string) => void
}

export function FilterTabs({ label, items, selected, onSelect }: FilterTabsProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
              selected === item
                ? 'bg-primary/10 border-primary text-foreground'
                : 'border-border bg-input-bg text-muted-foreground hover:bg-hover-bg'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
