import {
  buildPackageJson,
  buildTsconfig,
  baseTsconfigReferences,
  TSUP_CONFIG,
  TSCONFIG_BUILD,
  TURBO_JSON,
  VERSION_TS,
  vitestConfig,
} from './common.js';

export const name = 'openai-compatible';
export const description = 'OpenAI-compatible chat API (recommended)';

const DEFAULT_MODELS = ['example-model'];

export function getFiles(ctx) {
  const { name, pascalName, camelName, envPrefix } = ctx;
  const models = ctx.models?.length ? ctx.models : DEFAULT_MODELS;
  const modelUnion =
    models.length === 1
      ? `'${models[0]}'`
      : `\n${models.map(m => `  | '${m}'`).join('\n')}`;
  const exampleModel = models[0];

  const providerTs = `import { createOpenAICompatible } from '@ai-toolkit/openai-compatible';
import type { LanguageModelV3 } from '@ai-toolkit/provider';
import type { FetchFunction } from '@ai-toolkit/provider-utils';
import type { ${pascalName}ChatModelId } from './${name}-chat-options';
import { VERSION } from './version';

export interface ${pascalName}ProviderSettings {
  /**
Base URL for the ${name} API calls.
   */
  baseURL?: string;

  /**
API key for authenticating requests. Falls back to the \`${envPrefix}_API_KEY\` environment variable.
   */
  apiKey?: string;

  /**
Custom headers to include in the requests.
   */
  headers?: Record<string, string>;

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction;
}

export interface ${pascalName}Provider {
  /**
Creates a ${name} chat model for text generation.
   */
  (modelId: ${pascalName}ChatModelId): LanguageModelV3;

  /**
Creates a ${name} chat model for text generation.
   */
  languageModel(modelId: ${pascalName}ChatModelId): LanguageModelV3;
}

/**
Create a ${name} provider instance. Configure \`baseURL\` to point at your
OpenAI-compatible endpoint.
 */
export function create${pascalName}(options: ${pascalName}ProviderSettings = {}) {
  const compatible = createOpenAICompatible<${pascalName}ChatModelId, never, never, never>({
    name: '${name}',
    baseURL: options.baseURL ?? 'https://api.example.com/v1',
    // Resolved at factory time (never at import time) so importing this
    // module without credentials is safe. Swap in loadApiKey() from
    // '@ai-toolkit/provider-utils' for a strict missing-key error.
    apiKey: options.apiKey ?? process.env.${envPrefix}_API_KEY,
    headers: options.headers,
    fetch: options.fetch,
  });

  const languageModel = (modelId: ${pascalName}ChatModelId) =>
    compatible.languageModel(modelId);

  const provider = ((modelId: ${pascalName}ChatModelId) =>
    languageModel(modelId)) as ${pascalName}Provider;
  provider.languageModel = languageModel;

  return provider;
}

/**
Default ${name} provider instance. Requires the \`${envPrefix}_API_KEY\`
environment variable (or \`baseURL\` + key via \`create${pascalName}\`).
Prefer \`create${pascalName}\` in libraries to avoid reading the environment at import time.
 */
export const ${camelName} = create${pascalName}();

export { VERSION };
`;

  const optionsTs = `import { z } from 'zod/v4';

// TODO: replace with the real model ids from your API docs.
export type ${pascalName}ChatModelId = ${modelUnion};

export const ${camelName}ProviderOptionsSchema = z.object({
  /**
TODO: add provider-specific request parameters here.
   */
});

export type ${pascalName}ProviderOptions = z.infer<
  typeof ${camelName}ProviderOptionsSchema
>;
`;

  const errorTs = `import { createJsonErrorResponseHandler } from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';

// TODO: adjust to the real error payload of your API. Keep response
// schemas minimal (nullish, not optional) for provider API flexibility.
export const ${camelName}ErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string().nullish(),
    code: z.union([z.string(), z.number()]).nullish(),
  }),
});

export type ${pascalName}ErrorData = z.infer<typeof ${camelName}ErrorDataSchema>;

export const ${camelName}FailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: ${camelName}ErrorDataSchema,
  errorToMessage: data => data.error.message,
});
`;

  const indexTs = `export { create${pascalName}, ${camelName} } from './${name}-provider';
export type { ${pascalName}Provider, ${pascalName}ProviderSettings } from './${name}-provider';
export type { ${pascalName}ChatModelId } from './${name}-chat-options';
export { VERSION } from './version';
`;

  const testTs = `import { describe, expect, it } from 'vitest';
import { create${pascalName} } from './${name}-provider';

describe('${camelName} provider', () => {
  it('creates a chat model with the given model id', () => {
    const provider = create${pascalName}({ apiKey: 'test-key' });
    const model = provider.languageModel('${exampleModel}');
    expect(model.modelId).toBe('${exampleModel}');
    expect(model.specificationVersion).toBe('v3');
  });

  it('is callable as a function', () => {
    const provider = create${pascalName}({ apiKey: 'test-key' });
    expect(provider('${exampleModel}').modelId).toBe('${exampleModel}');
  });
});
`;

  const readme = `# AI TOOLKIT - ${pascalName} Provider

The **${name} provider** (\`@ai-toolkit/${name}\`) connects the AI TOOLKIT to any OpenAI-compatible chat API.

> Experimental: expect breaking changes between releases.

## Setup

\`\`\`bash
npm i @ai-toolkit/${name}
\`\`\`

Set the \`${envPrefix}_API_KEY\` environment variable (or pass \`apiKey\` / \`baseURL\` explicitly).

## Usage

\`\`\`ts
import { ${camelName} } from '@ai-toolkit/${name}';
import { generateText } from '@ai-toolkit/ai';

const result = await generateText({
  model: ${camelName}('${exampleModel}'),
  prompt: 'Hello!',
});
\`\`\`

Or with a custom endpoint:

\`\`\`ts
import { create${pascalName} } from '@ai-toolkit/${name}';

const ${camelName} = create${pascalName}({
  baseURL: 'https://api.example.com/v1',
  apiKey: process.env.${envPrefix}_API_KEY,
});
\`\`\`
`;

  return [
    {
      path: 'package.json',
      content: buildPackageJson({
        name,
        description: `${pascalName} provider for the AI TOOLKIT (OpenAI-compatible chat API)`,
        keywords: ['ai', name],
        dependencies: { '@ai-toolkit/openai-compatible': 'workspace:*' },
      }),
    },
    { path: 'tsup.config.ts', content: TSUP_CONFIG },
    {
      path: 'tsconfig.json',
      content: buildTsconfig({
        references: baseTsconfigReferences([{ path: '../openai-compatible' }]),
      }),
    },
    { path: 'tsconfig.build.json', content: TSCONFIG_BUILD },
    { path: 'turbo.json', content: TURBO_JSON },
    { path: 'vitest.node.config.js', content: vitestConfig('node') },
    { path: 'vitest.edge.config.js', content: vitestConfig('edge') },
    { path: 'src/version.ts', content: VERSION_TS },
    { path: 'src/index.ts', content: indexTs },
    { path: `src/${name}-provider.ts`, content: providerTs },
    { path: `src/${name}-chat-options.ts`, content: optionsTs },
    { path: `src/${name}-error.ts`, content: errorTs },
    { path: `src/${name}-provider.test.ts`, content: testTs },
    { path: 'README.md', content: readme },
  ];
}
