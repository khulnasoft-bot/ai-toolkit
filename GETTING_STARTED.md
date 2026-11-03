# Getting Started with AI Toolkit

AI Toolkit is a complete TypeScript AI engineering platform for building, orchestrating, executing, evaluating, securing, and operating AI agents and applications across any model provider.

This guide walks you through the core capabilities and the four platform dimensions: **Intelligence**, **Execution**, **Operations**, and **Platform**.

---

## 1. Install

```bash
# Create a new project
npm create vite@latest my-ai-app -- --template react-ts
cd my-ai-app

# Install AI Toolkit and a provider
npm install ai-toolkit @ai-toolkit/openai
```

---

## 2. Intelligence — Generate Text

The core SDK (`ai-toolkit`) provides `generateText` and `streamText`.

```typescript
import { generateText } from 'ai-toolkit';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain the 400% platform architecture in one sentence.',
});

console.log(result.text);
```

---

## 3. Execution — Build an Agent

The **Agent Platform** (`@ai-toolkit/agents`) provides an execute loop with planning.

```typescript
import { createAgent } from '@ai-toolkit/agents';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const agent = createAgent({
  modelId: 'openai/gpt-4o',
  name: 'research-agent',
  instructions: 'Research the topic and return key findings.',
  maxSteps: 5,
});

const result = await agent.execute(
  'What are the benefits of TypeScript for AI apps?',
);
console.log(result.output);
```

### Agent + Tools (Cross-Domain)

The **Tool Platform** (`@ai-toolkit/tools`) lets agents call tools.

```typescript
import { createAgent } from '@ai-toolkit/agents';
import { createToolRegistry } from '@ai-toolkit/tools';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tools = createToolRegistry();

tools.registerTool({
  name: 'echo',
  description: 'Echoes back text.',
  parameters: {
    type: 'object',
    properties: { text: { type: 'string' } },
    required: ['text'],
  },
  execute: async ({ text }) => text,
});

const agent = createAgent({
  modelId: 'openai/gpt-4o',
  name: 'tool-agent',
  instructions: 'Use the echo tool when asked to repeat text.',
});

const result = await agent.execute('Say hello using the echo tool.');
console.log(result.output);
```

---

## 4. Execution — Memory & Context

The **Memory System** (`@ai-toolkit/memory`) and **Context Management** (`@ai-toolkit/context`) let you persist and retrieve conversation state.

```typescript
import { createMemoryManager } from '@ai-toolkit/memory';

const memory = createMemoryManager();

memory.store({
  id: 'user-pref-1',
  content: 'User prefers concise answers.',
  type: 'long-term',
  metadata: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const entries = memory.search('preference');
console.log(`Found ${entries.length} matching memories.`);
```

---

## 5. Operations — Evaluate an Agent

The **Evaluation Engine** (`@ai-toolkit/evals`) measures agent output quality.

```typescript
import { createEvaluationEngine, type Evaluation } from '@ai-toolkit/evals';

const evalEngine = createEvaluationEngine();

evalEngine.registerEvaluator('quality-check', {
  evaluate: async ({ name }) => {
    const answer = 'AI Toolkit is a TypeScript platform.';
    return {
      length: answer.length,
      has_toolkit: answer.includes('AI Toolkit') ? 1 : 0,
    };
  },
});

const evaluation: Evaluation = {
  id: 'eval-001',
  name: 'quality-check',
  modelId: 'openai/gpt-4o',
  metrics: {},
  status: 'completed',
};

const scores = await evalEngine.run(evaluation);
console.log(scores);
```

---

## 6. Platform — Unified Catalog

The **Platform** (`@ai-toolkit/platform`) is a single source of truth for providers, models, gateways, tools, templates, recipes, and content.

```typescript
import { PlatformRegistry, createPlatformApi } from '@ai-toolkit/platform';

const registry = new PlatformRegistry({
  schemaVersion: 1,
  registryVersion: 'v1',
  generatedAt: new Date().toISOString(),
  records: [],
});

const api = createPlatformApi(registry);

const response = await api.handle({
  pathname: '/api/platform/v1/catalog',
  searchParams: new URLSearchParams({ type: 'provider' }),
});

console.log(response.body);
```

---

## 7. Cross-Domain Example

Combine agents, memory, context, and tools in one application:

```bash
# Run the cross-domain example
cd examples/01-foundations/cross-domain-agent
npm install
npm test
```

Other integration examples:

| Example                  | Domains           | Path                                       |
| ------------------------ | ----------------- | ------------------------------------------ |
| Agents + Workflow        | agents, workflow  | `examples/01-foundations/agents-workflow`  |
| Retrieval + Agents (RAG) | retrieval, agents | `examples/01-foundations/retrieval-agents` |
| Evals + Agents           | evals, agents     | `examples/01-foundations/evals-agents`     |

---

## 8. Developer CLI & Studio

The **Developer CLI** (`@ai-toolkit/tooling-cli`) and **Studio UI** (`@ai-toolkit/ui-studio`) are functional cross-domain tools:

```typescript
// CLI — echo, ask, memory commands
import { createCLIEngine } from '@ai-toolkit/tooling-cli';
const engine = createCLIEngine();

// Studio — platform dashboard
import { createStudioDashboard } from '@ai-toolkit/ui-studio';
const studio = createStudioDashboard();
await studio.render();
```

Codegen generates agent scaffolding:

```typescript
import { createAgentGenerator } from '@ai-toolkit/tooling-codegen';
const generator = createAgentGenerator();
const code = await generator.generate({
  template: 'MyAgent',
  language: 'typescript',
  outputDir: './src',
});
```

---

## Next Steps

- Explore the [examples directory](../examples/) for runnable integrations
- Read the [architecture docs](architecture/) for the 400% platform vision
- Check [ARCHITECTURE_QUICK_REFERENCE.md](ARCHITECTURE_QUICK_REFERENCE.md) for the package map
- Review [architecture/DEPENDENCY_RULES.md](architecture/DEPENDENCY_RULES.md) for layer dependency rules

---

**Platform layers**: Foundation (L0) • AI Core (L1) • Gateway (L3) • Providers (L1.5) • Protocol (L2) • Integration (L5) • Experience/Tooling (L6)

**400% Vision**: Intelligence + Execution + Operations + Platform capabilities across any model provider.
