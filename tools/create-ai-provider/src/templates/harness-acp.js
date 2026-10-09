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

export const name = 'harness-acp';
export const description = 'ACP agent harness profile (HarnessAgent)';

export function getFiles(ctx) {
  const { name, camelName } = ctx;
  // `--executable "my-agent --acp"` splits into command + args.
  const [executable = name, ...args] = (ctx.executable || '')
    .split(' ')
    .map(s => s.trim())
    .filter(Boolean);
  const argsLine =
    args.length > 0 ? `\n  args: [${args.map(a => `'${a}'`).join(', ')}],` : '';
  // `my-agent` (npm package) -> `acp-my-agent` harness id convention.
  const harnessId = name.startsWith('harness-')
    ? name.replace(/^harness-/, 'acp-')
    : `acp-${name}`;
  const exportName = `${camelName}Harness`;

  const profileTs = `import { createACP } from '@ai-toolkit/harness-acp';
import { VERSION } from './version';

/**
 * ${name} ACP harness profile (\`${executable}${args.length ? ` ${args.join(' ')}` : ''}\`).
 *
 * TODO: verify the install source, model mapping, credential env, and
 * permission modes against the agent's ACP implementation, then delete
 * this comment. See \`@ai-toolkit/harness-acp\` profiles for examples
 * (claude-code, codex, cursor, grok-build).
 */
export const ${exportName} = createACP({
  harnessId: '${harnessId}',
  source: { type: 'npm-simple', packageName: '${name}' },
  executable: '${executable}',${argsLine}
  // TODO: confirm how the agent selects models: 'session-config-option'
  // (config option id) or 'session-model' (set_model request property).
  modelMapping: { type: 'session-config-option', path: 'model' },
  clientApp: { name: 'ai-toolkit/${name}', version: VERSION },
});
`;

  const indexTs = `export { ${exportName} } from './${name}';
export { VERSION } from './version';
`;

  const testTs = `import { describe, expect, it } from 'vitest';
import { ${exportName} } from './${name}';

describe('${exportName}', () => {
  it('exposes a stable bootstrap identity', () => {
    expect(${exportName}.kind).toBe('acp');
    expect(${exportName}.version).toBe('v1');
    expect(${exportName}.getBootstrapIdentity()).toContain(
      \`harness:\${${exportName}.harnessId}\`,
    );
    expect(${exportName}.clientAppId).toContain('ai-toolkit/${name}');
  });
});
`;

  const readme = `# AI TOOLKIT - ${name} Harness

The **${name} harness** (\`@ai-toolkit/${name}\`) connects \`HarnessAgent\` to ${name} via **ACP version 1**, built on \`@ai-toolkit/harness-acp\`.

> Experimental: expect breaking changes between releases.

## Setup

\`\`\`bash
npm i @ai-toolkit/${name}
\`\`\`

## Usage

\`\`\`ts
import { ${exportName} } from '@ai-toolkit/${name}';

// const agent = new HarnessAgent({ harness: ${exportName}, sandbox });
\`\`\`

## Details

- Executable: \`${executable}${args.length ? ` ${args.join(' ')}` : ''}\`
- Protocol: ACP v1 (\`createACP\` from \`@ai-toolkit/harness-acp\`)
`;

  return [
    {
      path: 'package.json',
      content: buildPackageJson({
        name,
        description: `${name} ACP harness profile for the AI TOOLKIT`,
        keywords: ['ai', 'acp', 'harness', name],
        dependencies: { '@ai-toolkit/harness-acp': 'workspace:*' },
      }),
    },
    { path: 'tsup.config.ts', content: TSUP_CONFIG },
    {
      path: 'tsconfig.json',
      content: buildTsconfig({
        references: baseTsconfigReferences([{ path: '../harness-acp' }]),
      }),
    },
    { path: 'tsconfig.build.json', content: TSCONFIG_BUILD },
    { path: 'turbo.json', content: TURBO_JSON },
    { path: 'vitest.node.config.js', content: vitestConfig('node') },
    { path: 'vitest.edge.config.js', content: vitestConfig('edge') },
    { path: 'src/version.ts', content: VERSION_TS },
    { path: 'src/index.ts', content: indexTs },
    { path: `src/${name}.ts`, content: profileTs },
    { path: `src/${name}.test.ts`, content: testTs },
    { path: 'README.md', content: readme },
  ];
}
