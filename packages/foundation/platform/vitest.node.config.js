import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const version = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
).version;

export default defineConfig({
  define: {
    __PACKAGE_VERSION__: JSON.stringify(version),
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    typecheck: {
      enabled: true,
    },
  },
});
