import { createAgent, type Agent } from '@ai-toolkit/agents';
import {
  createEvaluationEngine,
  type Evaluation,
} from '@ai-toolkit/evals';
import { createOpenAI } from '@ai-toolkit/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

function makeTestAgent(): Agent {
  return createAgent({
    modelId: 'openai/gpt-4o',
    name: 'test-agent',
    description: 'Agent under evaluation.',
    instructions: 'Answer the question concisely and accurately.',
  });
}

const agent = makeTestAgent();

const evalEngine = createEvaluationEngine();

// Register an evaluator that checks answer length and keyword presence
evalEngine.registerEvaluator('quality-check', {
  evaluate: async (_evaluation) => {
    const answer =
      _evaluation.name === 'concise-answer'
        ? 'AI Toolkit is a TypeScript platform for building AI applications.'
        : '';
    const metrics: Record<string, number> = {
      length: answer.length,
      has_toolkit: answer.includes('AI Toolkit') ? 1 : 0,
      has_typescript: answer.includes('TypeScript') ? 1 : 0,
    };
    return metrics;
  },
});

async function run(): Promise<void> {
  // Step 1: Agent generates an answer
  const result = await agent.execute(
    'Describe AI Toolkit in one sentence.',
  );
  console.log(`Agent answer: ${result.output}`);

  // Step 2: Evaluate the agent's output
  const evaluation: Evaluation = {
    id: 'eval-001',
    name: 'concise-answer',
    modelId: 'openai/gpt-4o',
    metrics: {},
    status: 'completed',
  };

  const scores = await evalEngine.run(evaluation);
  console.log('Evaluation scores:');
  for (const [key, value] of Object.entries(scores)) {
    console.log(`  ${key}: ${value}`);
  }

  console.log('Evals + Agents integration complete.');
}

run().catch(console.error);
