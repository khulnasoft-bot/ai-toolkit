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

export const name = 'full-custom';
export const description =
  'Custom LanguageModelV3 from scratch (TODO skeleton)';

export function getFiles(ctx) {
  const { name, pascalName, camelName, envPrefix } = ctx;

  const modelTs = `import type {
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3GenerateResult,
  LanguageModelV3StreamResult,
} from '@ai-toolkit/provider';
import { generateId } from '@ai-toolkit/provider-utils';
import type { ${pascalName}ChatModelId } from './${name}-chat-options';

export interface ${pascalName}ChatConfig {
  provider: string;
  baseURL: string;
  headers: () => Record<string, string | undefined>;
  generateId: () => string;
  fetch?: import('@ai-toolkit/provider-utils').FetchFunction;
}

/**
 * TODO: implement \`doGenerate\` / \`doStream\` against your HTTP API.
 * Use \`postJsonToApi\` + \`createJsonResponseHandler\` /
 * \`createEventSourceResponseHandler\` from \`@ai-toolkit/provider-utils\`,
 * \`safeParseJSON\` (never \`JSON.parse\`), and the error handler from
 * \`./${name}-error\` for failure responses.
 */
export class ${pascalName}ChatLanguageModel implements LanguageModelV3 {
  readonly specificationVersion = 'v3';

  readonly modelId: ${pascalName}ChatModelId;

  private readonly config: ${pascalName}ChatConfig;

  constructor(modelId: ${pascalName}ChatModelId, config: ${pascalName}ChatConfig) {
    this.modelId = modelId;
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  async doGenerate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: LanguageModelV3CallOptions,
  ): Promise<LanguageModelV3GenerateResult> {
    throw new Error(
      'TODO: implement doGenerate for ${name} (id: ' + generateId() + ')',
    );
  }

  async doStream(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: LanguageModelV3CallOptions,
  ): Promise<LanguageModelV3StreamResult> {
    throw new Error('TODO: implement doStream for ${name}');
  }
}
`;

  const providerTs = `import type { LanguageModelV3 } from '@ai-toolkit/provider';
import {
  generateId,
  loadApiKey,
  withoutTrailingSlash,
  withUserAgentSuffix,
} from '@ai-toolkit/provider-utils';
import type { FetchFunction } from '@ai-toolkit/provider-utils';
import { ${pascalName}ChatLanguageModel } from './${name}-chat-language-model';
import type { ${pascalName}ChatModelId } from './${name}-chat-options';
import { VERSION } from './version';

export interface ${pascalName}ProviderSettings {
  /**
Base URL for the ${name} API calls.
   */
  baseURL?: string;

  /**
API key for authenticating requests.
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

export function create${pascalName}(options: ${pascalName}ProviderSettings = {}) {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? 'https://api.example.com/v1',
  )!;
  const getHeaders = () =>
    withUserAgentSuffix(
      {
        Authorization: \`Bearer \${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: '${envPrefix}_API_KEY',
          description: '${pascalName}',
        })}\`,
        ...options.headers,
      },
      \`ai-toolkit/${name}/\${VERSION}\`,
    );

  const languageModel = (modelId: ${pascalName}ChatModelId) =>
    new ${pascalName}ChatLanguageModel(modelId, {
      provider: '${name}.chat',
      baseURL,
      headers: getHeaders,
      generateId,
      fetch: options.fetch,
    });

  const provider = ((modelId: ${pascalName}ChatModelId) =>
    languageModel(modelId)) as ${pascalName}Provider;
  provider.languageModel = languageModel;

  return provider;
}
`;

  const optionsTs = `// TODO: replace with the real model ids from your API docs.
export type ${pascalName}ChatModelId = 'example-model' | (string & {});
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

  const indexTs = `export { create${pascalName} } from './${name}-provider';
export type { ${pascalName}Provider, ${pascalName}ProviderSettings } from './${name}-provider';
export type { ${pascalName}ChatModelId } from './${name}-chat-options';
export { VERSION } from './version';
`;

  const testTs = `import { describe, expect, it } from 'vitest';
import { create${pascalName} } from './${name}-provider';

describe('${camelName} provider', () => {
  it('creates a chat model with the given model id', () => {
    const provider = create${pascalName}({ apiKey: 'test-key' });
    const model = provider.languageModel('example-model');
    expect(model.modelId).toBe('example-model');
    expect(model.specificationVersion).toBe('v3');
  });

  it('throws a TODO until doGenerate is implemented', async () => {
    const provider = create${pascalName}({ apiKey: 'test-key' });
    await expect(
      provider.languageModel('example-model').doGenerate({ prompt: [] }),
    ).rejects.toThrow(/TODO/);
  });
});
`;

  const readme = `# AI TOOLKIT - ${pascalName} Provider

The **${name} provider** (\`@ai-toolkit/${name}\`) connects the AI TOOLKIT to ${name}.

> Experimental: expect breaking changes between releases.

## Setup

\`\`\`bash
npm i @ai-toolkit/${name}
\`\`\`

Set the \`${envPrefix}_API_KEY\` environment variable.

## Usage

\`\`\`ts
import { create${pascalName} } from '@ai-toolkit/${name}';
import { generateText } from '@ai-toolkit/ai';

const ${camelName} = create${pascalName}();

const result = await generateText({
  model: ${camelName}('example-model'),
  prompt: 'Hello!',
});
\`\`\`

## TODO

This scaffold implements the provider wiring. Still to do:

- Implement \`doGenerate\` / \`doStream\` in \`src/${name}-chat-language-model.ts\`
- Fill in real model ids in \`src/${name}-chat-options.ts\`
- Match the error payload in \`src/${name}-error.ts\`
`;

  return [
    {
      path: 'package.json',
      content: buildPackageJson({
        name,
        description: `${pascalName} provider for the AI TOOLKIT`,
        keywords: ['ai', name],
        dependencies: {},
      }),
    },
    { path: 'tsup.config.ts', content: TSUP_CONFIG },
    {
      path: 'tsconfig.json',
      content: buildTsconfig({ references: baseTsconfigReferences() }),
    },
    { path: 'tsconfig.build.json', content: TSCONFIG_BUILD },
    { path: 'turbo.json', content: TURBO_JSON },
    { path: 'vitest.node.config.js', content: vitestConfig('node') },
    { path: 'vitest.edge.config.js', content: vitestConfig('edge') },
    { path: 'src/version.ts', content: VERSION_TS },
    { path: 'src/index.ts', content: indexTs },
    { path: `src/${name}-provider.ts`, content: providerTs },
    {
      path: `src/${name}-chat-language-model.ts`,
      content: modelTs,
    },
    { path: `src/${name}-chat-options.ts`, content: optionsTs },
    { path: `src/${name}-error.ts`, content: errorTs },
    { path: `src/${name}-provider.test.ts`, content: testTs },
    { path: 'README.md', content: readme },
  ];
}
