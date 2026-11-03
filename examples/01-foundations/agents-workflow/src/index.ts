import { createAgent, type Agent } from '@ai-toolkit/agents';
import {
  createWorkflowEngine,
  type WorkflowDefinition,
} from '@ai-toolkit/workflow';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

function makeAgent(name: string, instructions: string): Agent {
  return createAgent({
    modelId: 'openai/gpt-4o',
    name,
    description: `Agent for ${name}`,
    instructions,
  });
}

const researchAgent = makeAgent(
  'research-agent',
  'Research the given topic and return key findings.',
);
const writeAgent = makeAgent(
  'write-agent',
  'Write a concise summary based on research findings.',
);
const reviewAgent = makeAgent(
  'review-agent',
  'Review the summary for accuracy and completeness.',
);

const engine = createWorkflowEngine();

const workflow: WorkflowDefinition = {
  id: 'content-pipeline',
  name: 'Content Research Pipeline',
  description: 'Research → Write → Review workflow orchestrating agents',
  steps: [
    { id: 'research', action: 'research-agent', dependencies: [] },
    { id: 'write', action: 'write-agent', dependencies: ['research'] },
    { id: 'review', action: 'review-agent', dependencies: ['write'] },
  ],
};

engine.register(workflow);

async function run(): Promise<void> {
  // Simulate workflow execution by running agents in dependency order
  const results = new Map<string, string>();

  for (const step of workflow.steps) {
    const agent =
      step.action === 'research-agent'
        ? researchAgent
        : step.action === 'write-agent'
          ? writeAgent
          : reviewAgent;

    const input =
      step.action === 'write-agent'
        ? `Research findings: ${results.get('research')}`
        : step.action === 'review-agent'
          ? `Summary to review: ${results.get('write')}`
        : 'AI agent platforms';

    const result = await agent.execute(input);
    results.set(step.id, result.output);
    console.log(`[${step.id}] ${result.output}`);
  }

  console.log('Workflow + Agents integration complete.');
}

run().catch(console.error);
