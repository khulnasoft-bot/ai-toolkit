export const templates = {
  'next-react': {
    name: 'next-react',
    description: 'Next.js + React',
    files: [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'src/app/globals.css',
      'src/lib/ai.ts',
    ],
  },
  'next-rsc': {
    name: 'next-rsc',
    description: 'Next.js + React Server Components',
    files: [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'src/lib/ai.ts',
    ],
  },
  'vite-react': {
    name: 'vite-react',
    description: 'Vite + React',
    files: [
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'index.html',
      'src/main.tsx',
      'src/App.tsx',
      'src/lib/ai.ts',
    ],
  },
  vue: {
    name: 'vue',
    description: 'Vue 3',
    files: [
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'index.html',
      'src/main.ts',
      'src/App.vue',
      'src/lib/ai.ts',
    ],
  },
  svelte: {
    name: 'svelte',
    description: 'SvelteKit',
    files: [
      'package.json',
      'svelte.config.js',
      'tsconfig.json',
      'src/routes/+page.svelte',
      'src/lib/ai.ts',
    ],
  },
  node: {
    name: 'node',
    description: 'Node.js API',
    files: ['package.json', 'tsconfig.json', 'src/index.ts', 'src/lib/ai.ts'],
  },
};

export const providers = {
  openai: {
    name: 'openai',
    package: '@ai-toolkit/openai',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini'],
  },
  anthropic: {
    name: 'anthropic',
    package: '@ai-toolkit/anthropic',
    models: ['claude-3-7-sonnet', 'claude-3-5-sonnet', 'claude-3-5-haiku'],
  },
  google: {
    name: 'google',
    package: '@ai-toolkit/google',
    models: ['gemini-2-flash', 'gemini-1-5-pro', 'gemini-1-5-flash'],
  },
  azure: {
    name: 'azure',
    package: '@ai-toolkit/azure',
    models: ['gpt-4o', 'gpt-4o-mini'],
  },
  bedrock: {
    name: 'bedrock',
    package: '@ai-toolkit/amazon-bedrock',
    models: ['llama-3-1-405b', 'claude-3-sonnet'],
  },
};

export const defaultFiles = {
  'package.json': {
    template: (name, provider) => ({
      name,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        ai: 'latest',
        '@ai-toolkit/react': 'latest',
        [provider.package]: 'latest',
        react: '^18',
        'react-dom': '^18',
        next: '^14',
      },
      devDependencies: {
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        typescript: '^5',
        eslint: '^8',
        'eslint-config-next': '^14',
      },
    }),
  },
  'src/lib/ai.ts': {
    template: (
      name,
      provider,
    ) => `import { generateText } from '@ai-toolkit/ai';
import { ${provider.name} } from '${provider.package}';

export async function generateCompletion(prompt: string) {
  const result = await generateText({
    model: ${provider.name}('${provider.models[0]}'),
    prompt,
  });

  return result.text;
}
`,
  },
};

export function getTemplate(name) {
  return templates[name] || templates['next-react'];
}

export function getProvider(name) {
  return providers[name] || providers.openai;
}

export function getAllTemplates() {
  return Object.values(templates);
}

export function getAllProviders() {
  return Object.values(providers);
}
