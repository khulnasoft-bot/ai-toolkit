'use client'

import { useState, useCallback, useEffect } from 'react'
import { Header } from '@/components/header'
import { PromptInput } from '@/components/playground/prompt-input'
import { ModelCard } from '@/components/playground/model-card'
import { ModelSelector } from '@/components/playground/model-selector'
import { HistoryPanel } from '@/components/playground/history-panel'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings } from 'lucide-react'

interface SelectedModel {
  provider: string
  model: string
}

interface ModelResponse {
  content: string
  tokens: number
  cost: number
  time: number
}

interface HistoryItem {
  id: string
  prompt: string
  timestamp: Date
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<SelectedModel[]>([
    { provider: 'OpenAI', model: 'gpt-4-turbo' },
    { provider: 'Anthropic', model: 'claude-3-opus' },
  ])
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('playground-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        )
      } catch (e) {
        console.error('Failed to load history', e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('playground-history', JSON.stringify(history))
  }, [history])

  const generateModelKey = (model: SelectedModel) =>
    `${model.provider}-${model.model}`

  const handleAddModel = () => {
    // In a real implementation, this would open a modal to select models
    const newModel: SelectedModel = {
      provider: 'Groq',
      model: 'mixtral-8x7b-32768',
    }
    if (!selectedModels.some((m) => generateModelKey(m) === generateModelKey(newModel))) {
      setSelectedModels([...selectedModels, newModel])
    }
  }

  const handleRemoveModel = (index: number) => {
    const key = generateModelKey(selectedModels[index])
    const newSelectedModels = selectedModels.filter((_, i) => i !== index)
    setSelectedModels(newSelectedModels)

    const newResponses = { ...responses }
    delete newResponses[key]
    setResponses(newResponses)

    const newLoading = { ...loading }
    delete newLoading[key]
    setLoading(newLoading)

    const newErrors = { ...errors }
    delete newErrors[key]
    setErrors(newErrors)
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return

    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      prompt,
      timestamp: new Date(),
    }
    setHistory((prev) => [historyItem, ...prev.slice(0, 49)])

    // Set loading state for all models
    const loadingState: Record<string, boolean> = {}
    selectedModels.forEach((model) => {
      loadingState[generateModelKey(model)] = true
    })
    setLoading(loadingState)
    setErrors({})

    // Simulate API calls to different models
    for (const model of selectedModels) {
      const key = generateModelKey(model)

      setTimeout(async () => {
        try {
          // Simulate API response with delay
          const delay = Math.random() * 2000 + 1000
          await new Promise((resolve) => setTimeout(resolve, delay))

          // Mock response - in production this would call real APIs
          const mockResponse: ModelResponse = {
            content: generateMockResponse(model.provider, prompt),
            tokens: Math.floor(Math.random() * 500) + 100,
            cost: parseFloat((Math.random() * 0.01 + 0.001).toFixed(5)),
            time: (Math.random() * 2 + 0.5).toFixed(2) as any,
          }

          setResponses((prev) => ({ ...prev, [key]: mockResponse }))
          setLoading((prev) => ({ ...prev, [key]: false }))
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            [key]: error instanceof Error ? error.message : 'Unknown error',
          }))
          setLoading((prev) => ({ ...prev, [key]: false }))
        }
      }, 0)
    }
  }, [prompt, selectedModels])

  const handleClear = () => {
    setPrompt('')
    setResponses({})
    setErrors({})
  }

  const handleSelectHistory = (item: HistoryItem) => {
    setPrompt(item.prompt)
    setResponses({})
    setErrors({})
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Selector */}
            <ModelSelector
              selectedModels={selectedModels}
              onAdd={handleAddModel}
              onRemove={handleRemoveModel}
            />

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Temperature: {temperature.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls randomness. Higher values = more creative.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="4096"
                    step="128"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum length of generated response.
                  </p>
                </div>
              </div>
            </Card>

            {/* History */}
            <HistoryPanel
              history={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt</CardTitle>
                <CardDescription>
                  Enter your prompt to test across all selected models
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={handleSubmit}
                  onClear={handleClear}
                  isLoading={Object.values(loading).some((v) => v)}
                />
              </div>
            </Card>

            {/* Model Responses Grid */}
            {selectedModels.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Responses
                </h2>
                <div
                  className={`grid gap-6 ${
                    selectedModels.length === 1
                      ? 'grid-cols-1'
                      : selectedModels.length === 2
                        ? 'grid-cols-1 md:grid-cols-2'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {selectedModels.map((model, index) => {
                    const key = generateModelKey(model)
                    return (
                      <ModelCard
                        key={key}
                        provider={model.provider}
                        model={model.model}
                        response={responses[key]}
                        isLoading={loading[key] || false}
                        error={errors[key]}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock response generator
function generateMockResponse(provider: string, prompt: string): string {
  const responses: Record<string, string[]> = {
    OpenAI: [
      `This is a response from OpenAI's GPT-4 model. Based on your prompt: "${prompt.substring(0, 50)}..."\n\nThe AI-powered playground allows you to compare responses from multiple language models side by side. This helps you understand how different models approach the same task with different writing styles, perspectives, and levels of detail.`,
      `OpenAI's model provides a sophisticated response to your query. Using advanced transformer architecture and reinforcement learning from human feedback (RLHF), the model generates coherent and contextually relevant text.`,
    ],
    Anthropic: [
      `Claude's response to your prompt: "${prompt.substring(0, 50)}..."\n\nAnthropically trained models focus on being helpful, harmless, and honest. This model attempts to provide a balanced and thoughtful response while considering potential implications and edge cases.`,
      `Anthropic's Claude model approaches this task by first understanding the context and intent behind your prompt, then generating a response that aims to be both informative and respectful of important nuances.`,
    ],
    Groq: [
      `Groq's fast inference model responds: "${prompt.substring(0, 50)}..."\n\nKnown for speed and efficiency, Groq's language models are optimized for rapid token generation while maintaining quality outputs. This makes them ideal for real-time applications.`,
      `This response from Groq demonstrates the model's ability to provide quick, relevant answers. The model is optimized for low-latency inference without sacrificing too much in terms of response quality.`,
    ],
    Google: [
      `Google's Gemini model responds: "${prompt.substring(0, 50)}..."\n\nBuilt with advanced training techniques, Gemini can process both text and visual information, providing a multimodal approach to understanding and responding to prompts.`,
      `Google's response showcases the model's ability to understand complex queries and provide detailed, well-structured responses that incorporate current information and research.`,
    ],
  }

  const options = responses[provider] || responses.OpenAI
  return options[Math.floor(Math.random() * options.length)]
}
