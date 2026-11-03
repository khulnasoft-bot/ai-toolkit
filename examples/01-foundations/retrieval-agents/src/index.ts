import { createAgent, type Agent } from '@ai-toolkit/agents';
import {
  createRetrievalEngine,
  type RetrievalResult,
} from '@ai-toolkit/retrieval';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const retrievalEngine = createRetrievalEngine();

// Register a mock retriever that returns domain knowledge
retrievalEngine.registerRetriever('knowledge-base', {
  retrieve: async (_query, _config) => {
    const results: RetrievalResult[] = [
      {
        id: 'doc-1',
        content:
          'AI Toolkit provides a unified TypeScript interface for building AI agents across providers.',
        score: 0.95,
        metadata: { source: 'docs' },
      },
      {
        id: 'doc-2',
        content:
          'Agents can use tools, maintain memory, and retrieve context to answer user questions.',
        score: 0.88,
        metadata: { source: 'docs' },
      },
    ];
    return results;
  },
});

function makeRagAgent(): Agent {
  return createAgent({
    modelId: 'openai/gpt-4o',
    name: 'rag-agent',
    description: 'Agent that retrieves context before answering.',
    instructions:
      'Answer the user question using only the retrieved context. ' +
      'If the context does not contain the answer, say so.',
  });
}

const agent = makeRagAgent();

async function run(): Promise<void> {
  const query = 'What capabilities does AI Toolkit provide for agents?';

  // Step 1: Retrieve relevant context
  const results = await retrievalEngine.retrieve(
    query,
    { topK: 5, minScore: 0.5 },
  );
  console.log(`Retrieved ${results.length} context documents:`);
  for (const r of results) {
    console.log(`  - ${r.content} (score: ${r.score})`);
  }

  // Step 2: Build context-augmented prompt
  const context = results.map(r => r.content).join('\n');
  const augmentedPrompt = `Context:\n${context}\n\nQuestion: ${query}`;

  // Step 3: Agent answers using retrieved context
  const result = await agent.execute(augmentedPrompt);
  console.log(`\nAgent answer: ${result.output}`);

  console.log('Retrieval + Agents (RAG) integration complete.');
}

run().catch(console.error);
