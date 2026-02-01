'use client'

import { Header } from '@/components/header'
import { Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Package, GitBranch, Users, TrendingUp, BookOpen } from 'lucide-react'

const PACKAGES = [
  { name: 'Core AI SDK', description: 'Main library for AI integrations', status: 'stable', version: '4.5.2' },
  { name: 'React SDK', description: 'React hooks and components', status: 'stable', version: '3.1.0' },
  { name: 'Svelte SDK', description: 'Svelte stores and utilities', status: 'stable', version: '2.8.1' },
  { name: 'Vue SDK', description: 'Vue 3 composables', status: 'beta', version: '1.2.0' },
  { name: 'MCP Protocol', description: 'Model Control Protocol support', status: 'stable', version: '2.0.0' },
  { name: 'Providers', description: 'All AI provider integrations', status: 'stable', version: '5.3.1' },
]

const PROVIDERS = [
  { name: 'OpenAI', models: 8, category: 'Large Language Models' },
  { name: 'Anthropic', models: 5, category: 'Large Language Models' },
  { name: 'Google Vertex', models: 6, category: 'Large Language Models' },
  { name: 'Groq', models: 3, category: 'Fast Inference' },
  { name: 'Perplexity', models: 2, category: 'Search & Knowledge' },
  { name: 'Hugging Face', models: 15, category: 'Open Source' },
]

const STATS = [
  { label: 'Total Packages', value: '25+', icon: Package },
  { label: 'AI Providers', value: '50+', icon: BarChart },
  { label: 'Community Contributors', value: '500+', icon: Users },
  { label: 'Example Functions', value: '100+', icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Project Overview</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive statistics and information about the Khulnasoft AI Toolkit
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardDescription className="text-xs">{stat.label}</CardDescription>
                    <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              <a
                href="/playground"
                className="flex items-center justify-between p-3 rounded-lg bg-input-bg hover:bg-hover-bg transition-colors group"
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Try Playground
                </span>
                <span className="text-lg">→</span>
              </a>
              <a
                href="/examples"
                className="flex items-center justify-between p-3 rounded-lg bg-input-bg hover:bg-hover-bg transition-colors group"
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Browse Examples
                </span>
                <span className="text-lg">→</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 rounded-lg bg-input-bg hover:bg-hover-bg transition-colors group"
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Read Documentation
                </span>
                <span className="text-lg">→</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 rounded-lg bg-input-bg hover:bg-hover-bg transition-colors group"
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  GitHub Repository
                </span>
                <span className="text-lg">→</span>
              </a>
            </div>
          </Card>

          {/* Repository Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                <span className="text-base">Repository</span>
              </CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Main Branch</div>
                <div className="text-sm font-mono text-foreground">khulnasoft-bot/ai-toolkit</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">License</div>
                <div className="text-sm text-foreground">Apache License 2.0</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="text-sm text-foreground">Open Source Monorepo</div>
              </div>
            </div>
          </Card>

          {/* Latest Update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-base">Latest</span>
              </CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Version</div>
                <div className="text-sm font-bold text-primary">v5.0.0</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Release Date</div>
                <div className="text-sm text-foreground">Feb 1, 2024</div>
              </div>
              <Button variant="secondary" size="sm" className="w-full text-xs">
                View Changelog
              </Button>
            </div>
          </Card>
        </div>

        {/* Packages Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Packages</h2>
            <p className="text-muted-foreground">
              Core packages included in the toolkit
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{pkg.name}</CardTitle>
                      <CardDescription className="mt-1">{pkg.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        pkg.status === 'stable'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{pkg.version}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Providers Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Supported Providers</h2>
            <p className="text-muted-foreground">
              AI providers integrated with the toolkit
            </p>
          </div>
          <div className="space-y-4">
            {['Large Language Models', 'Fast Inference', 'Search & Knowledge', 'Open Source'].map((category) => {
              const providersInCategory = PROVIDERS.filter(p => p.category === category)
              return (
                <div key={category}>
                  <div className="text-sm font-semibold text-foreground mb-3">{category}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {providersInCategory.map((provider, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{provider.name}</div>
                            <div className="text-xs text-muted-foreground">{provider.models} models</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{provider.models}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
