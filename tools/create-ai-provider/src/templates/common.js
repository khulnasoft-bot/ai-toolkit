export function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function toCamelCase(kebab) {
  const pascal = toPascalCase(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toEnvPrefix(kebab) {
  return kebab.replace(/-/g, '_').toUpperCase();
}

export function buildPackageJson({
  name,
  description,
  keywords,
  dependencies,
}) {
  return (
    JSON.stringify(
      {
        name: `@ai-toolkit/${name}`,
        version: '0.0.0',
        description,
        license: 'Apache-2.0',
        sideEffects: false,
        stability: 'alpha',
        owners: ['@khulnasoft/ai-toolkit-providers'],
        main: './dist/index.js',
        module: './dist/index.mjs',
        types: './dist/index.d.ts',
        source: './src/index.ts',
        files: ['dist/**/*', 'CHANGELOG.md', 'README.md'],
        scripts: {
          build: 'pnpm clean && tsup --tsconfig tsconfig.build.json',
          'build:watch': 'pnpm clean && tsup --watch',
          clean: 'del-cli dist *.tsbuildinfo',
          lint: 'eslint "./**/*.ts*"',
          'type-check': 'tsc --build',
          'prettier-check': 'prettier --check "./**/*.ts*"',
          test: 'pnpm test:node && pnpm test:edge',
          'test:update': 'pnpm test:node -u',
          'test:watch': 'vitest --config vitest.node.config.js',
          'test:edge': 'vitest --config vitest.edge.config.js --run',
          'test:node': 'vitest --config vitest.node.config.js --run',
        },
        exports: {
          './package.json': './package.json',
          '.': {
            types: './dist/index.d.ts',
            import: './dist/index.mjs',
            require: './dist/index.js',
            default: './dist/index.mjs',
          },
        },
        dependencies: {
          '@ai-toolkit/provider': 'workspace:*',
          '@ai-toolkit/provider-utils': 'workspace:*',
          ...dependencies,
        },
        devDependencies: {
          '@ai-toolkit/test-server': 'workspace:*',
          '@types/node': '20.17.24',
          '@khulnasoft/ai-tsconfig': 'workspace:*',
          tsup: '^8',
          typescript: '5.8.3',
          zod: '3.25.76',
        },
        peerDependencies: {
          zod: '^3.25.76 || ^4.1.8',
        },
        engines: {
          node: '>=18',
        },
        publishConfig: {
          access: 'public',
        },
        homepage: 'https://studio.khulnasoft.com/docs',
        repository: {
          type: 'git',
          url: 'git+https://github.com/khulnasoft/ai-toolkit.git',
        },
        bugs: {
          url: 'https://github.com/khulnasoft/ai-toolkit/issues',
        },
        keywords,
      },
      null,
      2,
    ) + '\n'
  );
}

export function buildTsconfig({ references }) {
  return (
    JSON.stringify(
      {
        extends: './node_modules/@khulnasoft/ai-tsconfig/ts-library.json',
        compilerOptions: {
          composite: true,
          rootDir: 'src',
          outDir: 'dist',
        },
        exclude: ['dist', 'build', 'node_modules', 'tsup.config.ts'],
        references,
      },
      null,
      2,
    ) + '\n'
  );
}

export const TSUP_CONFIG = `import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    define: {
      __PACKAGE_VERSION__: JSON.stringify(
        (await import('./package.json', { with: { type: 'json' } })).default
          .version,
      ),
    },
  },
]);
`;

export const TSCONFIG_BUILD = `{
  "extends": "./tsconfig.json",
  "compilerOptions": { "composite": false },
  "references": []
}
`;

export const TURBO_JSON = `{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["**/dist/**"]
    }
  }
}
`;

export function vitestConfig(mode) {
  return `import { defineConfig } from 'vite';
import packageJson from './package.json';

export default defineConfig({
  test: {
    environment: '${mode === 'edge' ? 'edge-runtime' : 'node'}',
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
  define: {
    __PACKAGE_VERSION__: JSON.stringify(packageJson.version),
  },
});
`;
}

export const VERSION_TS = `// Version string of this package injected at build time.
declare const __PACKAGE_VERSION__: string | undefined;
export const VERSION: string =
  typeof __PACKAGE_VERSION__ !== 'undefined'
    ? __PACKAGE_VERSION__
    : '0.0.0-test';
`;

export function baseTsconfigReferences(extra = []) {
  return [
    { path: '../../validation/provider' },
    { path: '../../core/provider-utils' },
    ...extra,
  ];
}
