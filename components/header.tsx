'use client'

import { Button } from './ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-lg text-foreground">AI Toolkit</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="/playground" className="text-muted-foreground hover:text-foreground transition-colors">
              Playground
            </a>
            <a href="/examples" className="text-muted-foreground hover:text-foreground transition-colors">
              Examples
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </nav>

          <Button variant="primary" size="md">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
