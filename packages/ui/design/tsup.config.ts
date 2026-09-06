import { defineConfig } from 'tsup';

export default defineConfig({
  // Each entry is emitted as its own file so the `./*` exports resolve to
  // `dist/<name>.js`. Client components stay in their own module so the
  // `use client` boundary is preserved for RSC.
  entry: [
    'src/index.ts',
    'src/utils.ts',
    'src/panel.tsx',
    'src/section.tsx',
    'src/status-pill.tsx',
    'src/kpi-card.tsx',
    'src/chart/sparkline.tsx',
    'src/chart/bars.tsx',
    'src/chart/donut.tsx',
    'src/icon-button.tsx',
    'src/code-block.tsx',
    'src/data-table.tsx',
    'src/filter-bar.tsx',
    'src/drawer.tsx',
  ],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  // Disable code splitting; the CJS build emits an ESM passthrough index
  // (bare `export *`) when entries re-export other entries, which breaks
  // Node's CommonJS resolution.
  splitting: false,
  external: ['react', 'react-dom', 'lucide-react'],
  // Declarations are emitted with `tsc --emitDeclarationOnly` in the build
  // script: tsup's dts resolver follows pnpm store realpaths and picks up
  // the React 19 @types/react used by other workspaces.
  dts: false,
  sourcemap: true,
});
