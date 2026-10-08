var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// package.json
var package_exports = {};
__export(package_exports, {
  default: () => package_default
});
var package_default;
var init_package = __esm({
  "package.json"() {
    package_default = {
      name: "@ai-toolkit/deepseek",
      version: "2.0.0",
      license: "Apache-2.0",
      sideEffects: false,
      stability: "stable",
      owners: [
        "@khulnasoft/ai-toolkit-providers"
      ],
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      source: "./src/index.ts",
      files: [
        "dist/**/*",
        "CHANGELOG.md",
        "README.md"
      ],
      scripts: {
        build: "pnpm clean && tsup --tsconfig tsconfig.build.json",
        "build:watch": "pnpm clean && tsup --watch",
        clean: "del-cli dist *.tsbuildinfo",
        lint: 'eslint "./**/*.ts*"',
        "type-check": "tsc --build",
        "prettier-check": 'prettier --check "./**/*.ts*"',
        test: "pnpm test:node && pnpm test:edge",
        "test:update": "pnpm test:node -u",
        "test:watch": "vitest --config vitest.node.config.js",
        "test:edge": "vitest --config vitest.edge.config.js --run",
        "test:node": "vitest --config vitest.node.config.js --run"
      },
      exports: {
        "./package.json": "./package.json",
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.mjs",
          require: "./dist/index.js",
          default: "./dist/index.js"
        }
      },
      dependencies: {
        "@ai-toolkit/provider": "workspace:*",
        "@ai-toolkit/provider-utils": "workspace:*"
      },
      devDependencies: {
        "@ai-toolkit/test-server": "workspace:*",
        "@types/node": "20.17.24",
        "@khulnasoft/ai-tsconfig": "workspace:*",
        tsup: "^8",
        typescript: "5.8.3",
        zod: "3.25.76"
      },
      peerDependencies: {
        zod: "^3.25.76 || ^4.1.8"
      },
      engines: {
        node: ">=18"
      },
      publishConfig: {
        access: "public"
      },
      homepage: "https://studio.khulnasoft.com/docs",
      repository: {
        type: "git",
        url: "git+https://github.com/khulnasoft/ai-toolkit.git"
      },
      bugs: {
        url: "https://github.com/khulnasoft/ai-toolkit/issues"
      },
      keywords: [
        "ai"
      ]
    };
  }
});

// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    define: {
      __PACKAGE_VERSION__: JSON.stringify(
        (await Promise.resolve().then(() => (init_package(), package_exports))).default.version
      )
    }
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInRzdXAuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcIkBhaS10b29sa2l0L2RlZXBzZWVrXCIsXG4gIFwidmVyc2lvblwiOiBcIjIuMC4wXCIsXG4gIFwibGljZW5zZVwiOiBcIkFwYWNoZS0yLjBcIixcbiAgXCJzaWRlRWZmZWN0c1wiOiBmYWxzZSxcbiAgXCJzdGFiaWxpdHlcIjogXCJzdGFibGVcIixcbiAgXCJvd25lcnNcIjogW1xuICAgIFwiQGtodWxuYXNvZnQvYWktdG9vbGtpdC1wcm92aWRlcnNcIlxuICBdLFxuICBcIm1haW5cIjogXCIuL2Rpc3QvaW5kZXguanNcIixcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXgubWpzXCIsXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICBcInNvdXJjZVwiOiBcIi4vc3JjL2luZGV4LnRzXCIsXG4gIFwiZmlsZXNcIjogW1xuICAgIFwiZGlzdC8qKi8qXCIsXG4gICAgXCJDSEFOR0VMT0cubWRcIixcbiAgICBcIlJFQURNRS5tZFwiXG4gIF0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcInBucG0gY2xlYW4gJiYgdHN1cCAtLXRzY29uZmlnIHRzY29uZmlnLmJ1aWxkLmpzb25cIixcbiAgICBcImJ1aWxkOndhdGNoXCI6IFwicG5wbSBjbGVhbiAmJiB0c3VwIC0td2F0Y2hcIixcbiAgICBcImNsZWFuXCI6IFwiZGVsLWNsaSBkaXN0ICoudHNidWlsZGluZm9cIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgXFxcIi4vKiovKi50cypcXFwiXCIsXG4gICAgXCJ0eXBlLWNoZWNrXCI6IFwidHNjIC0tYnVpbGRcIixcbiAgICBcInByZXR0aWVyLWNoZWNrXCI6IFwicHJldHRpZXIgLS1jaGVjayBcXFwiLi8qKi8qLnRzKlxcXCJcIixcbiAgICBcInRlc3RcIjogXCJwbnBtIHRlc3Q6bm9kZSAmJiBwbnBtIHRlc3Q6ZWRnZVwiLFxuICAgIFwidGVzdDp1cGRhdGVcIjogXCJwbnBtIHRlc3Q6bm9kZSAtdVwiLFxuICAgIFwidGVzdDp3YXRjaFwiOiBcInZpdGVzdCAtLWNvbmZpZyB2aXRlc3Qubm9kZS5jb25maWcuanNcIixcbiAgICBcInRlc3Q6ZWRnZVwiOiBcInZpdGVzdCAtLWNvbmZpZyB2aXRlc3QuZWRnZS5jb25maWcuanMgLS1ydW5cIixcbiAgICBcInRlc3Q6bm9kZVwiOiBcInZpdGVzdCAtLWNvbmZpZyB2aXRlc3Qubm9kZS5jb25maWcuanMgLS1ydW5cIlxuICB9LFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLi9wYWNrYWdlLmpzb25cIjogXCIuL3BhY2thZ2UuanNvblwiLFxuICAgIFwiLlwiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2luZGV4LmQudHNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2luZGV4Lm1qc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gICAgICBcImRlZmF1bHRcIjogXCIuL2Rpc3QvaW5kZXguanNcIlxuICAgIH1cbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFpLXRvb2xraXQvcHJvdmlkZXJcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQGFpLXRvb2xraXQvcHJvdmlkZXItdXRpbHNcIjogXCJ3b3Jrc3BhY2U6KlwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBhaS10b29sa2l0L3Rlc3Qtc2VydmVyXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiMjAuMTcuMjRcIixcbiAgICBcIkBraHVsbmFzb2Z0L2FpLXRzY29uZmlnXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcInRzdXBcIjogXCJeOFwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIjUuOC4zXCIsXG4gICAgXCJ6b2RcIjogXCIzLjI1Ljc2XCJcbiAgfSxcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcInpvZFwiOiBcIl4zLjI1Ljc2IHx8IF40LjEuOFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xOFwiXG4gIH0sXG4gIFwicHVibGlzaENvbmZpZ1wiOiB7XG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9zdHVkaW8ua2h1bG5hc29mdC5jb20vZG9jc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9raHVsbmFzb2Z0L2FpLXRvb2xraXQuZ2l0XCJcbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9raHVsbmFzb2Z0L2FpLXRvb2xraXQvaXNzdWVzXCJcbiAgfSxcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJhaVwiXG4gIF1cbn1cbiIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi92ZXJjZWwvc2hhcmUvdjAtcHJvamVjdC9wYWNrYWdlcy9wcm92aWRlcnMvZGVlcHNlZWsvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL3ZlcmNlbC9zaGFyZS92MC1wcm9qZWN0L3BhY2thZ2VzL3Byb3ZpZGVycy9kZWVwc2Vla1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vdmVyY2VsL3NoYXJlL3YwLXByb2plY3QvcGFja2FnZXMvcHJvdmlkZXJzL2RlZXBzZWVrL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbXG4gIHtcbiAgICBlbnRyeTogWydzcmMvaW5kZXgudHMnXSxcbiAgICBmb3JtYXQ6IFsnY2pzJywgJ2VzbSddLFxuICAgIGR0czogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1BBQ0tBR0VfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgKGF3YWl0IGltcG9ydCgnLi9wYWNrYWdlLmpzb24nLCB7IHdpdGg6IHsgdHlwZTogJ2pzb24nIH0gfSkpLmRlZmF1bHRcbiAgICAgICAgICAudmVyc2lvbixcbiAgICAgICksXG4gICAgfSxcbiAgfSxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDRSxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsTUFDWCxhQUFlO0FBQUEsTUFDZixXQUFhO0FBQUEsTUFDYixRQUFVO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQVE7QUFBQSxNQUNSLFFBQVU7QUFBQSxNQUNWLE9BQVM7QUFBQSxNQUNULFFBQVU7QUFBQSxNQUNWLE9BQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDVCxPQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixPQUFTO0FBQUEsUUFDVCxNQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxrQkFBa0I7QUFBQSxRQUNsQixNQUFRO0FBQUEsUUFDUixlQUFlO0FBQUEsUUFDZixjQUFjO0FBQUEsUUFDZCxhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsS0FBSztBQUFBLFVBQ0gsT0FBUztBQUFBLFVBQ1QsUUFBVTtBQUFBLFVBQ1YsU0FBVztBQUFBLFVBQ1gsU0FBVztBQUFBLFFBQ2I7QUFBQSxNQUNGO0FBQUEsTUFDQSxjQUFnQjtBQUFBLFFBQ2Qsd0JBQXdCO0FBQUEsUUFDeEIsOEJBQThCO0FBQUEsTUFDaEM7QUFBQSxNQUNBLGlCQUFtQjtBQUFBLFFBQ2pCLDJCQUEyQjtBQUFBLFFBQzNCLGVBQWU7QUFBQSxRQUNmLDJCQUEyQjtBQUFBLFFBQzNCLE1BQVE7QUFBQSxRQUNSLFlBQWM7QUFBQSxRQUNkLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxrQkFBb0I7QUFBQSxRQUNsQixLQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1QsTUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGVBQWlCO0FBQUEsUUFDZixRQUFVO0FBQUEsTUFDWjtBQUFBLE1BQ0EsVUFBWTtBQUFBLE1BQ1osWUFBYztBQUFBLFFBQ1osTUFBUTtBQUFBLFFBQ1IsS0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE1BQVE7QUFBQSxRQUNOLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxVQUFZO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTs7O0FDeEUwUyxTQUFTLG9CQUFvQjtBQUV2VSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQjtBQUFBLElBQ0UsT0FBTyxDQUFDLGNBQWM7QUFBQSxJQUN0QixRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsSUFDckIsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLE1BQ04scUJBQXFCLEtBQUs7QUFBQSxTQUN2QixNQUFNLGlFQUFzRCxRQUMxRDtBQUFBLE1BQ0w7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
