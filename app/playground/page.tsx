'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { SettingsPanel } from '@/components/playground/settings-panel'
import { ResponseViewer } from '@/components/playground/response-viewer'
import { useState } from 'react'
import { Play } from 'lucide-react'

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { id: 'groq', name: 'Groq', models: ['mixtral-8x7b', 'llama2-70b'] },
  { id: 'google', name: 'Google', models: ['gemini-pro', 'palm-2'] },
]

const FUNCTIONS = [
  { id: 'generateText', name: 'Generate Text', description: 'Generate text content from a prompt' },
  { id: 'generateObject', name: 'Generate Object', description: 'Generate structured JSON objects' },
  { id: 'streamText', name: 'Stream Text', description: 'Stream text responses in real-time' },
  { id: 'generateImage', name: 'Generate Image', description: 'Generate images from text descriptions' },
]

export default function PlaygroundPage() {
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [selectedFunction, setSelectedFunction] = useState('generateText')
  const [prompt, setPrompt] = useState('Write a short story about a robot learning to dance')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [topP, setTopP] = useState(1)

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider)
  const currentFunction = FUNCTIONS.find(f => f.id === selectedFunction)

  const handleRun = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          function: selectedFunction,
          prompt,
          parameters: {
            temperature,
            maxTokens,
            topP,
          },
        }),
      })
      const data = await response.json()
      setResponse(data.result || data.error || 'No response')
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response)
  }

  const handleClearAll = () => {
    setPrompt('')
    setResponse('')
    setSelectedProvider('openai')
    setSelectedModel('gpt-4')
    setSelectedFunction('generateText')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Playground</h1>
          <p className="text-lg text-muted-foreground">
            Test different AI providers, models, and functions with your own prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Provider Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Provider</CardTitle>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6">
                {PROVIDERS.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => {
                      setSelectedProvider(provider.id)
                      setSelectedModel(provider.models[0])
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedProvider === provider.id
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'border-border bg-input-bg text-muted-foreground hover:bg-hover-bg'
                    }`}
                  >
                    <div className="font-medium">{provider.name}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Model Selection */}
            {currentProvider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Model</CardTitle>
                </CardHeader>
                <div className="space-y-3 px-6 pb-6">
                  {currentProvider.models.map(model => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${
                        selectedModel === model
                          ? 'bg-primary/10 border-primary text-foreground'
                          : 'border-border bg-input-bg text-muted-foreground hover:bg-hover-bg'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Function Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Function</CardTitle>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6">
                {FUNCTIONS.map(func => (
                  <button
                    key={func.id}
                    onClick={() => setSelectedFunction(func.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedFunction === func.id
                        ? 'bg-primary/10 border-primary'
                        : 'border-border bg-input-bg hover:bg-hover-bg'
                    }`}
                  >
                    <div className={`font-medium ${selectedFunction === func.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {func.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{func.description}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prompt</CardTitle>
                <CardDescription>Enter your prompt or question</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter your prompt here..."
                />
              </div>
            </Card>

            {/* Run Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleRun}
                disabled={loading}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                onClick={handleClearAll}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Clear
              </Button>
            </div>

            {/* Response Output */}
            <ResponseViewer
              response={response}
              loading={loading}
              onCopy={handleCopyResponse}
            />
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <SettingsPanel
              temperature={temperature}
              maxTokens={maxTokens}
              topP={topP}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onTopPChange={setTopP}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
