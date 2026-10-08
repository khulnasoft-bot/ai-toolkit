# Contributing to the AI TOOLKIT

We deeply appreciate your interest in contributing to our repository! Whether you're reporting bugs, suggesting enhancements, improving docs, or submitting pull requests, your contributions help improve the project for everyone.

## Repository Architecture

```
packages/
├── core/           ← Foundation SDK (generateText, streamText, etc.)
├── providers/      ← LLM integrations (OpenAI, Anthropic, Google, etc.)
├── adapters/       ← Framework support (React, Vue, Angular, Svelte)
├── mcp/            ← Model Context Protocol
├── special/        ← Gateway, internal tools
├── validation/     ← Schema validation
└── infrastructure/ ← Testing utilities & tooling

examples/           ← Organized by complexity & use case
├── 01-foundations/
├── 02-framework-integration/
├── 03-integrations/
└── 04-tools/
```

## Reporting Bugs

If you've encountered a bug in the project, we encourage you to report it to us. Please follow these steps:

1. **Check the Issue Tracker**: Before submitting a new bug report, please check our issue tracker to see if the bug has already been reported. If it has, you can add to the existing report.
2. **Create a New Issue**: If the bug hasn't been reported, create a new issue. Provide a clear title and a detailed description of the bug. Include any relevant logs, error messages, and steps to reproduce the issue.

## Suggesting Enhancements

We're always looking for suggestions to make our project better. If you have an idea for an enhancement, please:

1. **Check the Issue Tracker**: Similar to bug reports, please check if someone else has already suggested the enhancement.
2. **Create a New Issue**: If your enhancement hasn't been suggested yet, create a new issue.

## Improving Documentation

Documentation is crucial for understanding and using our project effectively.
You can find the content of our docs under `apps/docs/content/`.

To fix smaller typos, you can edit the code directly in GitHub or use Github.dev (press `.` in Github).

## Code Contributions

### Environment Setup

AI TOOLKIT development requires PNPM v10+ and Node v18+.

### Setting Up the Repository Locally

```bash
git clone https://github.com/khulnasoft/ai-toolkit
cd ai-toolkit
pnpm install
pnpm build
pnpm health-check  # Verify your setup
```

### Finding Code

```bash
# List all providers
ls packages/providers/

# List all adapters
ls packages/adapters/

# Find who owns a package
pnpm find-package --owner react

# Search for a package
pnpm find-package openai
```

### Generators

```bash
# Scaffold a new provider
pnpm generate provider --name=my-provider

# Scaffold a new adapter
pnpm generate adapter --framework=react

# Scaffold a new example
pnpm generate example --level=01-foundations --name=my-example
```

### Running the Examples

```bash
cd examples/01-foundations/ai-functions
pnpm tsx src/stream-text/openai.ts
```

### Local Development Workflow

#### Building Packages

```bash
pnpm build                      # Build everything
pnpm build --filter=@ai-toolkit/react  # Build specific package
```

#### Testing Packages

```bash
pnpm test                       # Run all tests
pnpm test --filter=@ai-toolkit/react  # Test specific package
```

#### Before Submitting

```bash
pnpm format          # Format code
pnpm types:check     # Check types
pnpm test            # Run tests
pnpm validate-structure  # Verify structure compliance
```

#### Adding package dependencies

Please run `pnpm update-references` in workspace root to update the `references` section in the `tsconfig.json` file.

### Submitting Pull Requests

1. **Create a New Branch**: Name it `feature/`, `fix/`, `docs/`, `chore/`, or `test/`.
2. **Add a patch changeset**: Run `pnpm changeset` and select changed packages.
   - **Please do not use minor or major changesets without coordination**.
   - You don't need to select `examples/*` packages (they are not published).
3. **Add a codemod**: If the change introduces a deprecation or breaking change, add a codemod if possible.
4. **Fix prettier issues**: Run `pnpm prettier-fix`.
5. **Push and open a PR** with a clear title and description.

## Learn More

- **Architecture**: `architecture/PROJECT-STRUCTURE.md` + `architecture/domain-mapping.md`
- **Quick Reference**: `ARCHITECTURE_QUICK_REFERENCE.md`
- **Onboarding**: `CONTRIBUTOR_ONBOARDING.md`
- **Decisions**: `ADR/` directory
- **Examples**: `examples/` directory
