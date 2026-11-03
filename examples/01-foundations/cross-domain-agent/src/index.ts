import {
  createAgent,
  createAgentRegistry,
  type Agent,
} from '@ai-toolkit/agents';
import { createMemoryStore, type MemoryEntry } from '@ai-toolkit/memory';
import { createToolRegistry, type Tool } from '@ai-toolkit/tools';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const memory = createMemoryStore();

const tools = createToolRegistry();

const echoTool: Tool = {
  id: 'echo',
  name: 'Echo',
  description: 'Echoes back the given text.',
  parameters: {
    type: 'object',
    properties: { text: { type: 'string' } },
    required: ['text'],
  },
  execute: async ({ text }: { text: string }) => text,
};

tools.register('echo', echoTool);

const agent: Agent = createAgent({
  modelId: 'openai/gpt-4o',
  name: 'cross-domain-agent',
  description: 'Agent using memory, context, and tools.',
  instructions:
    'You are a helpful assistant. Use the echo tool when asked to repeat text. ' +
    'Remember user preferences using memory.',
});

const registry = createAgentRegistry();
registry.registerAgent('cross-domain-agent', agent);

function storeMemory(content: string, type: MemoryEntry['type']): void {
  memory.store({
    id: `mem-${Date.now()}`,
    content,
    type,
    metadata: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

async function run(): Promise<void> {
  // Store a user preference in memory
  storeMemory('user prefers concise answers', 'long-term');

  // Retrieve relevant memory
  const relevant = memory.search('preference');
  console.log('Relevant memory entries:', relevant.length);

  // Execute the agent
  const result = await agent.execute('Say hello using the echo tool.');
  console.log('Agent result:', result.output);

  // Store the interaction in episodic memory
  storeMemory(
    `User asked to echo; agent responded: ${result.output}`,
    'episodic',
  );

  console.log('Cross-domain integration complete.');
}

run().catch(console.error);
