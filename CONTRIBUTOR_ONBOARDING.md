# Contributor Onboarding Guide

Welcome to the AI Toolkit! This guide will get you from zero to productive in **under 30 minutes**.

## Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- pnpm 10+ (`npm install -g pnpm@latest`)
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/khulnasoft/ai-toolkit.git
cd ai-toolkit

# 2. Install dependencies
pnpm install

# 3. Verify setup
pnpm health-check

# Expected output:
# ✅ TypeScript OK
# ✅ Turbo OK
# ✅ All workspaces OK
# ✅ Git hooks OK
```

### What You Can Do Now

```bash
# Run the full test suite
pnpm test

# Lint and format code
pnpm format

# Start development
pnpm dev

# Build everything
pnpm build
```

---

## Repository Structure (10 minutes)

Understanding the layout helps you contribute effectively.

### Core Concepts

```
packages/
├── core/           ← Foundation (generateText, streamText, etc.)
├── providers/      ← LLM integrations (OpenAI, Anthropic, etc.)
├── adapters/       ← Framework support (React, Vue, Angular, etc.)
├── mcp/            ← Model Context Protocol
├── special/        ← Gateway, internal tools
└── infrastructure/ ← Testing utilities

examples/          ← Organized reference implementations (see registry.json)
├── 01-foundations/          → Basic patterns
├── 02-framework-integration/ → React, Next.js, Vue, etc.
├── 03-integrations/         → Provider-specific examples
└── 04-tools/                → Developer tools and playgrounds

apps/
├── docs/          ← Main documentation site
└── www/           ← Website / marketing

tools/            ← Build & dev tools
```

### Finding Code

**Looking for a provider?**

```bash
ls packages/providers/openai/  # @ai-toolkit/openai
ls packages/providers/anthropic/  # @ai-toolkit/anthropic
```

**Looking for a framework?**

```bash
ls packages/adapters/react/  # React hooks
ls packages/adapters/rsc/    # Next.js RSC
```

**Looking for an example?**

```bash
find examples -type d -name "*openai*"  # All OpenAI examples
ls examples/02-framework-integration/  # All framework examples
```

---

## Finding Your First Contribution

### Good First Issues

1. **Documentation**: Fix typos, improve examples
2. **Examples**: Add a new simple example
3. **Bug Fixes**: Search for issues labeled `good-first-issue`
4. **Tests**: Improve test coverage
5. **Tooling**: Help improve developer experience

### Contribution Paths

#### Path 1: Fix Documentation (15 minutes)

```bash
# 1. Find an error in docs
# 2. Edit files in apps/docs/content/
# 3. Submit PR

# Example: Fix a typo
code apps/docs/content/01-getting-started/index.mdx

# Verify it renders locally
pnpm --filter @ai-toolkit/apps dev:docs
# Visit http://localhost:3000
```

#### Path 2: Add a Simple Example (30 minutes)

```bash
# 1. Generate example scaffold
pnpm generate example \
  --level=01-foundations \
  --name=my-example

# 2. Implement the example
code examples/01-foundations/my-example/

# 3. Add test
code examples/01-foundations/my-example/test.ts

# 4. Submit PR
```

#### Path 3: Fix a Bug (varies)

```bash
# 1. Find issue you can fix
# 2. Create feature branch
git checkout -b fix/issue-description

# 3. Locate the code
# Use CODEOWNERS to identify domain owners

# 4. Make changes
# Write a test first
# Implement the fix

# 5. Verify
pnpm test:core

# 6. Submit PR with reference to issue
```

#### Path 4: Improve Test Coverage (1 hour)

```bash
# 1. Find package with low coverage
pnpm test:core -- --coverage

# 2. Identify untested code
# 3. Write tests
# 4. Verify coverage improves

pnpm test --filter=@ai-toolkit/react -- --coverage
```

---

## Common Tasks

### Running Tests

```bash
# All tests
pnpm test

# Specific package
pnpm test --filter=@ai-toolkit/react

# Watch mode (per package)
cd packages/adapters/react && pnpm test:watch

# With coverage
pnpm test -- --coverage

# Providers only
pnpm test:providers

# A specific test file
pnpm test -- useChat.test.ts
```

### Type Checking

```bash
# Check entire repo
pnpm types:check

# Build all type definitions
pnpm types:build

# Watch mode
pnpm types:check -- --watch
```

### Linting & Formatting

```bash
# Format entire repo
pnpm format

# Check formatting
pnpm format:check

# Lint with biome
pnpm lint:check

# Markdown lint
pnpm lint:markdown
```

### Building

```bash
# Build everything
pnpm build

# Build specific package
pnpm build --filter=@ai-toolkit/react

# Clean build
pnpm clean && pnpm build
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/issue-number
# or
git checkout -b docs/improve-readme
```

**Naming convention:**

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation
- `chore/` — Maintenance
- `test/` — Test improvements

### 2. Make Changes

```bash
# Edit files
code packages/adapters/react/src/use-chat.ts

# Run tests
pnpm test --filter=@ai-toolkit/react

# Check types
pnpm types:check

# Format code
pnpm format
```

### 3. Commit with Changeset

A "changeset" documents what changed and helps with releases.

```bash
# Create a changeset
pnpm changeset

# Follow the prompts:
# 1. Select packages that changed
# 2. Choose change type:
#    - major: Breaking change
#    - minor: New feature (backwards compatible)
#    - patch: Bug fix
# 3. Write a summary: "Add support for streaming in useChat"
```

This creates a file in `.changeset/` that gets included in your PR.

### 4. Push & Create PR

```bash
git push origin feature/my-feature
```

Then create a PR on GitHub. The template will guide you through the details.

**PR Checklist:**

- [ ] Tests pass locally (`pnpm test`)
- [ ] Types check (`pnpm types:check`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Changeset created (`pnpm changeset`)
- [ ] Description explains the change

### 5. Code Review & Merge

- Reviewers identified automatically via `CODEOWNERS`
- Address feedback
- When approved, it merges automatically

---

## Understanding the Architecture

### The Four Layers

**Core Layer** (`packages/core/`)

- Foundation: generateText, streamText, generateObject
- Used by everyone else
- Most stable, best tested

**Provider Layer** (`packages/providers/`)

- Integrations with LLM APIs
- OpenAI, Anthropic, Google, etc.
- Each is independent

**Adapter Layer** (`packages/adapters/`)

- Framework-specific implementations
- React hooks, Next.js server actions, Vue composables
- Hide core complexity behind familiar APIs

**Tool Layer** (`packages/special/` + `tools/`)

- Developer utilities
- Gateway, KhulnaSoft packages
- Internal infrastructure

### Public vs Internal APIs

```typescript
// ✅ Public API - Use freely, stable
import { generateText } from 'ai-toolkit';
import { useChat } from '@ai-toolkit/react';

// ⚠️ Internal API - May change, don't depend on externally
import type { … } from 'ai-toolkit/internal';

// ℹ️ Example API - Copy & adapt, don't depend on
import { setupChat } from './example-setup';
```

### Ownership & Responsibilities

Each package has clear ownership. See `CODEOWNERS` file:

```bash
# Find who maintains the React adapter
grep "packages/adapters/react" CODEOWNERS
# Output: packages/adapters/react/ @khulnasoft/ai-react-team
```

---

## Common Workflows

### Adding a Feature to useChat

```bash
# 1. Find the code
code packages/adapters/react/src/use-chat.ts

# 2. Understand it
# - Hook implementation
# - Tests in use-chat.test.ts
# - Types in use-chat.types.ts

# 3. Add feature
# - Implement in use-chat.ts
# - Add tests in use-chat.test.ts
# - Update types if needed
# - Update docs in apps/docs/

# 4. Test
pnpm test --filter=@ai-toolkit/react

# 5. Create changeset
pnpm changeset
# Select: @ai-toolkit/react
# Type: minor (new feature)
# Message: "Add auto-scroll feature to useChat"
```

### Adding Support for a New Provider

```bash
# 1. Generate provider scaffold
pnpm generate provider --name=my-provider

# Creates: packages/providers/my-provider/
# With: src/, tests/, package.json, README.md

# 2. Implement required functions
# - createLanguageModel()
# - createTextEmbeddingModel()
# - createImageGenerationModel() (if supported)

# 3. Write tests
# Test the provider against the spec

# 4. Document
# Add README and example

# 5. Create example
pnpm generate example --level=03-integrations --name=my-provider-example

# 6. Test everything
pnpm test --filter=@ai-toolkit/my-provider
pnpm test --filter=@example/my-provider
```

### Improving Documentation

```bash
# 1. Find what to improve
code apps/docs/content/

# 2. Edit the markdown/mdx file
# Most docs are self-contained files

# 3. Preview locally
pnpm --filter @ai-toolkit/apps dev:docs
# Visit http://localhost:3000

# 4. Commit and submit PR
# No changeset needed for docs-only changes
```

---

## Debugging Tips

### Finding Why Tests Fail

```bash
# Run with verbose output
pnpm test -- --reporter=verbose

# Run a single test
pnpm test -- useChat.test.ts

# Run with debugging info
pnpm test -- --reporter=verbose --inspect-brk
```

### Type Errors

```bash
# Get full type information
pnpm types:check

# Check specific file
cd packages/adapters/react
pnpm type-check

# See error in VS Code: Ctrl+Shift+M
```

### Build Issues

```bash
# Clean everything
pnpm clean

# Rebuild from scratch
pnpm install && pnpm build

# Check specific package
pnpm build --filter=@ai-toolkit/react

# See build output
pnpm build -- --verbose
```

---

## Getting Help

### Stuck? Here's Where to Get Help

**For questions:**

- GitHub Discussions: https://github.com/khulnasoft/ai-toolkit/discussions
- Discord: [invite link]
- Twitter: @vercel, @ai_toolkit

**For bugs:**

- GitHub Issues: https://github.com/khulnasoft/ai-toolkit/issues
- Include: reproduction steps, error message, environment

**For guidance:**

- `AGENTS.md` + `architecture/PROJECT-STRUCTURE.md` — Understand the overall structure
- CONTRIBUTING.md — Contribution guidelines
- Code comments — Existing implementations
- Examples — How to use APIs

**For community:**

- GitHub Discussions
- Discord community
- Office hours (listed in README)

---

## Next Steps

1. **Run `pnpm health-check`** — Verify everything works
2. **Look at `AGENTS.md` and `architecture/`** — Understand the structure
3. **Find an issue** — Search `good-first-issue` label
4. **Make your first contribution** — Start small
5. **Join the community** — Discord, discussions, etc.

---

## Additional Resources

- **Architecture**: `AGENTS.md` + `architecture/` docs
- **Contributing**: `CONTRIBUTING.md`
- **Decisions**: `ADR/` directory
- **Examples**: `examples/` directory
- **Documentation**: `apps/docs/content/`

**Happy contributing! 🎉**
