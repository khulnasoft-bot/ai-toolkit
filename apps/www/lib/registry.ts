export type CatalogItem = { id: string; name: string; description: string; tags: string[]; meta: string }

export const providers: CatalogItem[] = [
  { id: 'openai', name: 'OpenAI', description: 'Production-ready models for text, vision, audio, and structured generation.', tags: ['Text', 'Vision', 'Embeddings'], meta: '12 models' },
  { id: 'anthropic', name: 'Anthropic', description: 'Build with Claude models designed for helpful, harmless, and honest AI.', tags: ['Reasoning', 'Tools', 'Vision'], meta: '8 models' },
  { id: 'google', name: 'Google Generative AI', description: 'Fast multimodal models with long context and native tool use.', tags: ['Multimodal', 'Long context'], meta: '10 models' },
  { id: 'mistral', name: 'Mistral', description: 'Open and efficient models for developers who want control.', tags: ['Open weights', 'EU hosting'], meta: '9 models' },
]
export const recipes: CatalogItem[] = [
  { id: 'streaming-chat', name: 'Streaming chat', description: 'Create a responsive streaming chat interface with a few lines of code.', tags: ['Chat', 'Next.js'], meta: '8 min read' },
  { id: 'structured-outputs', name: 'Structured outputs', description: 'Generate validated JSON that matches your TypeScript schema.', tags: ['Objects', 'Validation'], meta: '6 min read' },
  { id: 'tool-calling', name: 'Tool calling', description: 'Give your model safe, typed tools to take action in your application.', tags: ['Tools', 'Agents'], meta: '12 min read' },
]
export const tools: CatalogItem[] = [
  { id: 'search', name: 'Web Search', description: 'Search the web and return cited, grounded results to your model.', tags: ['Search', 'Grounding'], meta: 'Official' },
  { id: 'code-interpreter', name: 'Code Interpreter', description: 'Run Python in a secure sandbox for analysis and data workflows.', tags: ['Code', 'Sandbox'], meta: 'Community' },
  { id: 'filesystem', name: 'Filesystem', description: 'Read and write scoped files with explicit permissions.', tags: ['Files', 'Permissions'], meta: 'Official' },
]
export const showcase: CatalogItem[] = [
  { id: 'copilot', name: 'Support Copilot', description: 'A context-aware support assistant built for fast-moving teams.', tags: ['Next.js', 'Anthropic'], meta: 'Featured' },
  { id: 'research', name: 'Research Desk', description: 'Turn long documents into sourced briefs and decisions.', tags: ['RAG', 'OpenAI'], meta: 'Featured' },
  { id: 'creative', name: 'Creative Studio', description: 'Explore ideas with a multimodal workspace for design teams.', tags: ['Multimodal', 'Google'], meta: 'Community' },
]
export const allCatalog = [...providers, ...recipes, ...tools, ...showcase]
