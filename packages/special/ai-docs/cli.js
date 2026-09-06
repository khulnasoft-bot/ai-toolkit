#!/usr/bin/env node
// Committed entry point for the `aiDocs` bin. pnpm links workspace bins
// during install and skips any target that does not exist yet, so the bin must
// not point directly at build output: in a fresh monorepo checkout `dist` is
// only produced after install (Turbo builds the package before dependents run
// `ai-docs search sync`). This file always exists, and loads the compiled
// CLI from dist at run time.
import "./dist/cli/index.js";
