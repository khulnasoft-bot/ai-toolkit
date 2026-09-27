import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
  getTemplate,
  getProvider,
  getAllTemplates,
  getAllProviders,
  defaultFiles,
} from './templates.js';
import { ui, logger, chalk } from './logger.js';

function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function promptForChoice(rl, label, choices, defaultChoice) {
  ui.prompt(label);
  choices.forEach(c => {
    const isDefault = c.name === defaultChoice;
    if (isDefault) {
      ui.promptSelected(`${c.description} (${c.name})`);
    } else {
      ui.promptUnselected(`${c.description} (${c.name})`);
    }
  });

  while (true) {
    const answer = await askQuestion(
      rl,
      chalk.dim('│') + '  ' + 'Type a number or name to select: ',
    );
    const trimmed = answer.trim().toLowerCase();

    // Check by number
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num >= 1 && num <= choices.length) {
      return choices[num - 1].name;
    }

    // Check by name
    const match = choices.find(c => c.name === trimmed);
    if (match) return match.name;

    // Default to defaultChoice on empty
    if (!trimmed) return defaultChoice;

    // Re-prompt on invalid
    ui.log(chalk.yellow('Invalid selection.'));
  }
}

export async function createAIProject(options) {
  let {
    name,
    template,
    provider,
    install = true,
    interactive = true,
  } = options;

  const targetDir = path.resolve(process.cwd(), name);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${name}" already exists`);
  }

  ui.boxStart('create-ai-sdk');

  if (interactive) {
    const rl = createPrompt();
    try {
      if (!template) {
        const templates = getAllTemplates();
        template = await promptForChoice(
          rl,
          'Select a template',
          templates,
          'next-react',
        );
      }
      if (!provider) {
        const providers = getAllProviders();
        provider = await promptForChoice(
          rl,
          'Select an AI provider',
          providers,
          'openai',
        );
      }
    } finally {
      rl.close();
    }
  }

  const templateConfig = getTemplate(template);
  const providerConfig = getProvider(provider);

  ui.log(
    `Creating ${chalk.bold(templateConfig.description)} app: ${chalk.cyan(name)}`,
  );
  ui.divider();

  fs.mkdirSync(targetDir, { recursive: true });

  createFromTemplate(targetDir, templateConfig.name, providerConfig);

  if (install) {
    ui.log('Installing dependencies...');
    await installDependencies(targetDir);
  }

  ui.boxEnd();
  ui.log('');
  ui.log('Next steps:');
  ui.log(`  cd ${chalk.cyan(name)}`);
  if (!install) {
    ui.log(`  ${chalk.cyan('pnpm install')}`);
  }
  ui.log(`  ${chalk.cyan('pnpm dev')}`);
}

function createFromTemplate(dir, templateName, provider) {
  const packageJson = defaultFiles['package.json'].template(
    path.basename(dir),
    provider,
  );

  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n',
  );

  fs.mkdirSync(path.join(dir, 'src', 'lib'), { recursive: true });

  fs.writeFileSync(
    path.join(dir, 'src', 'lib', 'ai.ts'),
    defaultFiles['src/lib/ai.ts'].template(null, provider),
  );

  if (templateName.startsWith('next')) {
    fs.mkdirSync(path.join(dir, 'src', 'app'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'src', 'app', 'page.tsx'),
      getNextPage(templateName),
    );
    fs.writeFileSync(
      path.join(dir, 'src', 'app', 'layout.tsx'),
      `'use client';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
`,
    );
    fs.writeFileSync(
      path.join(dir, 'src', 'app', 'globals.css'),
      `body {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
`,
    );
  }

  if (templateName === 'node') {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src', 'index.ts'), getNodeIndex());
  }
}

function getNextPage(templateName) {
  return `'use client';

import { useState } from 'react';
import { generateText } from '@ai-toolkit/ai';
import { ${templateName === 'next-rsc' ? 'google' : 'openai'} } from '@ai-toolkit/${templateName === 'next-rsc' ? 'google' : 'openai'}';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { text } = await generateText({
        model: ${templateName === 'next-rsc' ? 'google' : 'openai'}('${templateName === 'next-rsc' ? 'gemini-2-flash' : 'gpt-4o'}'),
        prompt: input,
      });
      setOutput(text);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <main>
      <h1>AI Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      {output && <article>{output}</article>}
    </main>
  );
}
`;
}

function getNodeIndex() {
  return `import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

const prompt = process.argv[2] || 'Hello';

async function main() {
  const result = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  console.log(result.text);
}

main().catch(console.error);
`;
}

async function installDependencies(dir) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    await execAsync('pnpm install', { cwd: dir });
  } catch {
    try {
      await execAsync('npm install', { cwd: dir });
    } catch {
      logger.warn('Could not install dependencies automatically');
    }
  }
}
