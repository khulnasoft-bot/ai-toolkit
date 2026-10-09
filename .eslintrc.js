const { builtinModules } = require('module');

// Bare specifiers that resolve to Node.js builtins (mirrors the
// NODE_BUILTINS set in tools/scripts/validate-structure.mjs).
const nodeBuiltinSpecifiers = builtinModules.filter(
  name => !name.startsWith('node:'),
);

module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-khulnasoft-ai`
  extends: ['khulnasoft-ai'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  overrides: [
    {
      // Runtime-neutral packages (ADR-004, ADR-008): shipped source must not
      // import Node.js builtins. Declared here (not in tools/eslint-config)
      // because overrides `files` globs resolve relative to the declaring
      // config file, i.e. the repo root. Test files, dev scripts, fixtures
      // and tooling configs execute under Node by design and are excluded,
      // mirroring TEST_PATH in tools/scripts/validate-structure.mjs (which
      // remains the enforcing check; this rule gives editor/CI feedback).
      // NOTE: globals (e.g. `process`) are intentionally NOT restricted:
      // shipped source legitimately references them via capability detection
      // (e.g. `globalThis.process`), see @ai-toolkit/runtime.
      files: [
        'packages/core/**/*.ts',
        'packages/core/**/*.tsx',
        'packages/core/**/*.js',
        'packages/core/**/*.mjs',
        'packages/core/**/*.cjs',
        'packages/validation/**/*.ts',
        'packages/validation/**/*.tsx',
        'packages/validation/**/*.js',
        'packages/validation/**/*.mjs',
        'packages/validation/**/*.cjs',
      ],
      excludedFiles: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.test-d.ts',
        '**/*.test-d.tsx',
        '**/__tests__/**',
        '**/test/**',
        '**/__fixtures__/**',
        '**/__snapshots__/**',
        '**/scripts/**',
        '**/*.config.js',
        '**/*.config.mjs',
        '**/*.config.cjs',
        '**/*.config.ts',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: nodeBuiltinSpecifiers.map(name => ({
              name,
              message:
                'Runtime-neutral packages must not import Node.js builtins (ADR-004). Use @ai-toolkit/runtime capability detection instead.',
            })),
            patterns: [
              {
                group: ['node:*'],
                message:
                  'Runtime-neutral packages must not import Node.js builtins (ADR-004). Use @ai-toolkit/runtime capability detection instead.',
              },
            ],
          },
        ],
      },
    },
  ],
};
