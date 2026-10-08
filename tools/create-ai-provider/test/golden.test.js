import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchetype, getAllArchetypes } from '../src/templates/index.js';
import { buildContext, emitFiles } from '../src/create.js';
import { parseArgs, validateArgs } from '../src/args.js';

function scaffold(archetype, extra = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-ai-provider-'));
  const name = `test-${archetype.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'provider'}`;
  const ctx = buildContext({ name, archetype, ...extra });
  emitFiles(
    path.join(dir, 'packages/providers', name),
    getArchetype(archetype).getFiles(ctx),
  );
  return { dir, name, ctx };
}

function readJson(dir, name, file) {
  return JSON.parse(
    fs.readFileSync(path.join(dir, 'packages/providers', name, file), 'utf8'),
  );
}

describe('archetype registry', () => {
  it('exposes all three archetypes', () => {
    const names = getAllArchetypes()
      .map(a => a.name)
      .sort();
    assert.deepEqual(names, [
      'full-custom',
      'harness-acp',
      'openai-compatible',
    ]);
  });

  it('falls back to openai-compatible for unknown names', () => {
    assert.equal(getArchetype('nope').name, 'openai-compatible');
  });
});

describe('args', () => {
  it('parses name and flags', () => {
    const args = parseArgs([
      'my-provider',
      '-a',
      'harness-acp',
      '-e',
      'x --acp',
      '-y',
    ]);
    assert.equal(args.name, 'my-provider');
    assert.equal(args.archetype, 'harness-acp');
    assert.equal(args.executable, 'x --acp');
    assert.equal(args.skipPrompts, true);
  });

  it('rejects non-kebab-case names', () => {
    assert.throws(() => validateArgs({ name: 'Bad_Name' }), /kebab-case/);
  });

  it('rejects unknown archetypes', () => {
    assert.throws(
      () => validateArgs({ name: 'ok', archetype: 'nope' }),
      /Unknown archetype/,
    );
  });
});

for (const archetype of ['openai-compatible', 'harness-acp', 'full-custom']) {
  describe(`golden: ${archetype}`, () => {
    it('emits governance-compliant package.json', () => {
      const { dir, name } = scaffold(archetype, {
        models: ['model-a', 'model-b'],
        executable: 'my-agent --acp',
      });
      const pkg = readJson(dir, name, 'package.json');
      assert.equal(pkg.name, `@ai-toolkit/${name}`);
      assert.equal(pkg.version, '0.0.0');
      assert.equal(pkg.license, 'Apache-2.0');
      assert.equal(pkg.stability, 'alpha');
      assert.deepEqual(pkg.owners, ['@khulnasoft/ai-toolkit-providers']);
      assert.ok(pkg.exports['.'].types);
      assert.ok(pkg.exports['.'].import);
      assert.ok(pkg.exports['.'].require);
      assert.ok(pkg.exports['./package.json']);
      assert.ok(pkg.dependencies['@ai-toolkit/provider']);
      assert.ok(pkg.peerDependencies.zod);
    });

    it('emits shared scaffolding files', () => {
      const { dir, name } = scaffold(archetype);
      for (const file of [
        'tsup.config.ts',
        'tsconfig.json',
        'tsconfig.build.json',
        'turbo.json',
        'vitest.node.config.js',
        'vitest.edge.config.js',
        'src/version.ts',
        'src/index.ts',
        'README.md',
      ]) {
        assert.ok(
          fs.existsSync(path.join(dir, 'packages/providers', name, file)),
          `missing ${file}`,
        );
      }
      const tsconfig = readJson(dir, name, 'tsconfig.json');
      assert.ok(
        tsconfig.references.some(r => r.path === '../../validation/provider'),
      );
    });
  });
}

describe('golden: openai-compatible', () => {
  it('uses provided model ids in options and test', () => {
    const { dir, name } = scaffold('openai-compatible', {
      models: ['model-a'],
    });
    const base = path.join(dir, 'packages/providers', name, 'src');
    const options = fs.readFileSync(
      path.join(base, `${name}-chat-options.ts`),
      'utf8',
    );
    assert.match(options, /'model-a'/);
    const provider = fs.readFileSync(
      path.join(base, `${name}-provider.ts`),
      'utf8',
    );
    assert.match(provider, /createOpenAICompatible/);
    assert.doesNotMatch(provider, /import \{[^}]*loadApiKey/);
  });
});

describe('golden: harness-acp', () => {
  it('splits executable into command + args', () => {
    const { dir, name } = scaffold('harness-acp', {
      executable: 'my-agent --acp',
    });
    const profile = fs.readFileSync(
      path.join(dir, 'packages/providers', name, 'src', `${name}.ts`),
      'utf8',
    );
    assert.match(profile, /executable: 'my-agent'/);
    assert.match(profile, /args: \['--acp'\]/);
  });
});
