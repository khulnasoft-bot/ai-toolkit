'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, Brain, Code, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
              <span className="text-sm font-medium text-primary">Welcome to Khulnasoft AI Toolkit</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Build AI-Powered Applications
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore and experiment with the most comprehensive open-source AI toolkit. Test different providers, models, and functions all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg">
              Launch Playground
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">AI Providers Supported</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Example Functions</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Full</div>
              <div className="text-sm text-muted-foreground">Type-Safe Development</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to build with AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Multiple Providers</CardTitle>
                <CardDescription className="mt-2">
                  Support for OpenAI, Anthropic, Groq, and 40+ more AI providers
                </CardDescription>
              </div>
            </div>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Functions</CardTitle>
                <CardDescription className="mt-2">
                  Generate text, objects, tools, and embeddings with ease
                </CardDescription>
              </div>
            </div>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Code Examples</CardTitle>
                <CardDescription className="mt-2">
                  Browse and learn from 100+ production-ready examples
                </CardDescription>
              </div>
            </div>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Interactive Playground</CardTitle>
                <CardDescription className="mt-2">
                  Test and experiment with all AI functions in real-time
                </CardDescription>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Ready to Build?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the playground to test different AI models, providers, and functions with your own prompts.
          </p>
          <Button variant="primary" size="lg">
            Start Experimenting
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-muted-foreground">
          <p>&copy; 2024 Khulnasoft AI Toolkit. Open source and free to use.</p>
        </div>
      </footer>
    </div>
  )
}
