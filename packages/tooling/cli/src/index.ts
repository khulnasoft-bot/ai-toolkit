import { createAgent, type Agent, type AgentConfig } from '@ai-toolkit/agents';
import { createMemoryManager, type MemoryEntry } from '@ai-toolkit/memory';
import {
  createToolRegistry,
  type Tool,
  type ToolResult,
} from '@ai-toolkit/tools';

export type CLIOptions = {
  readonly command: string;
  readonly args: readonly string[];
  readonly verbose: boolean;
};

export interface CLI {
  run(options: CLIOptions): Promise<void>;
  help(): Promise<void>;
}

export interface CLIEngine {
  registerCLI(name: string, cli: CLI): void;
  getCLI(name: string): CLI | undefined;
}

export function createCLIEngine(): CLIEngine {
  const clis = new Map<string, CLI>();

  return {
    registerCLI: (name, cli) => clis.set(name, cli),
    getCLI: name => clis.get(name),
  };
}

function echoTool(): Tool {
  return {
    name: 'echo',
    description: 'Echoes back the provided text.',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
    execute: async args => {
      const text = (args as { text?: string }).text ?? '';
      const result: ToolResult = {
        toolName: 'echo',
        success: true,
        output: text,
      };
      return result;
    },
  };
}

function createAgentCLI(): CLI {
  const memory = createMemoryManager();
  const tools = createToolRegistry();
  tools.registerTool(echoTool());

  const config: AgentConfig = {
    modelId: 'openai/gpt-4o',
    name: 'cli-agent',
    description: 'Agent driven by the AI Toolkit CLI.',
    instructions:
      'You are a helpful CLI agent. Use the echo tool to repeat text when asked.',
    maxSteps: 3,
  };

  const agent = createAgent(config);

  function storeMemory(content: string, type: MemoryEntry['type']): void {
    memory.store({
      id: `cli-${Date.now()}`,
      content,
      type,
      metadata: { source: 'cli' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return {
    async run(options) {
      if (options.verbose) {
        console.log(`[cli] Registered tools: ${tools.listTools().length}`);
        console.log(`[cli] Memory entries: ${memory.list().length}`);
      }

      if (options.command === 'echo') {
        const text = options.args.join(' ');
        const tool = tools.getTool('echo');
        if (tool) {
          const result = await tool.execute({ text });
          console.log((result as ToolResult).output);
          storeMemory(`echo: ${text}`, 'short-term');
        } else {
          console.log(text);
        }
      } else if (options.command === 'ask') {
        const question = options.args.join(' ');
        const result = await agent.execute(question);
        console.log(result.output);
        storeMemory(`q: ${question}`, 'short-term');
        storeMemory(`a: ${result.output}`, 'long-term');
      } else if (options.command === 'memory') {
        const query = options.args.join(' ');
        const entries = memory.search(query);
        if (entries.length === 0) {
          console.log('No matching memory entries.');
        } else {
          for (const entry of entries) {
            console.log(`[${entry.type}] ${entry.content}`);
          }
        }
      } else {
        console.log(`Unknown command: ${options.command}`);
      }
    },

    async help() {
      console.log('AI Toolkit CLI');
      console.log('');
      console.log('Usage: ai-toolkit-cli <command> [args...]');
      console.log('');
      console.log('Commands:');
      console.log('  echo <text>       Echo text back (uses tools domain)');
      console.log('  ask <question>    Ask the agent (uses agents domain)');
      console.log('  memory <query>    Search memory (uses memory domain)');
      console.log('');
      console.log('Options:');
      console.log('  --verbose         Show domain registration info');
    },
  };
}
