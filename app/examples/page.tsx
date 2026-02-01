'use client'

import { Header } from '@/components/header'
import { Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { useState } from 'react'
import { Search, Copy, ExternalLink } from 'lucide-react'

const EXAMPLES = [
  {
    id: 1,
    title: 'Generate Text with OpenAI',
    description: 'Create a simple text generation prompt using OpenAI',
    category: 'Text Generation',
    provider: 'OpenAI',
    code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello, Claude" },
  ],
});
console.log(message);`,
  },
  {
    id: 2,
    title: 'Generate Structured Objects',
    description: 'Use the generateObject function to create structured data',
    category: 'Object Generation',
    provider: 'Anthropic',
    code: `import { generateObject } from "ai";
import { z } from "zod";

const result = await generateObject({
  model: "gpt-4-turbo",
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  prompt: "Generate a fake person",
});

console.log(result.object);`,
  },
  {
    id: 3,
    title: 'Stream Text Response',
    description: 'Stream AI responses in real-time with the streamText function',
    category: 'Streaming',
    provider: 'Groq',
    code: `import { streamText } from "ai";

const result = await streamText({
  model: "groq/mixtral-8x7b-32768",
  prompt: "What are the benefits of using AI?",
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}`,
  },
  {
    id: 4,
    title: 'Build a Chat Interface',
    description: 'Create an interactive chat application with multiple turns',
    category: 'Chat',
    provider: 'OpenAI',
    code: `import { generateText } from "ai";

const messages = [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "What is TypeScript?" },
];

const result = await generateText({
  model: "gpt-4-turbo",
  messages,
});

console.log(result.text);`,
  },
  {
    id: 5,
    title: 'Create Tool Use Functions',
    description: 'Enable AI to call functions and tools dynamically',
    category: 'Tool Use',
    provider: 'Anthropic',
    code: `import { tool } from "ai";
import { z } from "zod";

const getWeather = tool({
  description: "Get the current weather",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async ({ location }) => {
    return \`Weather in \${location}\`;
  },
});`,
  },
  {
    id: 6,
    title: 'Generate Embeddings',
    description: 'Create vector embeddings for semantic search',
    category: 'Embeddings',
    provider: 'OpenAI',
    code: `import { cosineSimilarity } from "ai";
import { generateEmbedding } from "ai";

const embedding1 = await generateEmbedding({
  model: "openai/text-embedding-3-small",
  value: "Hello world",
});

const embedding2 = await generateEmbedding({
  model: "openai/text-embedding-3-small",
  value: "Hi universe",
});`,
  },
]

const CATEGORIES = ['All', ...new Set(EXAMPLES.map(e => e.category))]
const PROVIDERS = ['All', ...new Set(EXAMPLES.map(e => e.provider))]

export default function ExamplesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProvider, setSelectedProvider] = useState('All')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredExamples = EXAMPLES.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(search.toLowerCase()) ||
      example.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || example.category === selectedCategory
    const matchesProvider = selectedProvider === 'All' || example.provider === selectedProvider
    return matchesSearch && matchesCategory && matchesProvider
  })

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Examples</h1>
          <p className="text-lg text-muted-foreground">
            Browse production-ready code examples to learn best practices
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search examples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Category</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                    selectedCategory === category
                      ? 'bg-primary/10 border-primary text-foreground'
                      : 'border-border bg-input-bg text-muted-foreground hover:bg-hover-bg'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Filter */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Provider</div>
            <div className="flex flex-wrap gap-2">
              {PROVIDERS.map(provider => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                    selectedProvider === provider
                      ? 'bg-primary/10 border-primary text-foreground'
                      : 'border-border bg-input-bg text-muted-foreground hover:bg-hover-bg'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExamples.length > 0 ? (
            filteredExamples.map(example => (
              <Card key={example.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="mt-2">{example.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {example.category}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {example.provider}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <div className="px-6 pb-6 flex-1 flex flex-col">
                  <div className="bg-input-bg rounded-lg p-4 mb-4 flex-1 overflow-y-auto">
                    <code className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                      {example.code}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(example.id, example.code)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    {copiedId === example.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No examples found matching your filters</p>
            </div>
          )}
        </div>
      </div>
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
