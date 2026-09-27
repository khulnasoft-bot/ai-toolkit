# Foundation Layer

The Foundation layer (Layer 0) provides the core types, interfaces, and runtime contracts that all other packages depend on. These packages must have no internal dependencies and must be browser-safe (no Node builtins).

## Packages

- `@ai-toolkit/provider` - Provider interface specifications and types
- `@ai-toolkit/runtime` - Browser-safe runtime contracts and capability detection
- `@ai-toolkit/capabilities` - Model capability declarations
- `@ai-toolkit/provider-utils` - Shared utilities for providers and core
- `@ai-toolkit/valibot` - Valibot schema adapter
- `@ai-toolkit/khulnasoft` - KhulnaSoft integration
- `@ai-toolkit/platform` - Platform registry and domain model

## Dependency Rules

Foundation packages may not depend on any other internal packages. They form the root of the dependency tree.

See `architecture/DEPENDENCY_RULES.md` for complete dependency rules.
