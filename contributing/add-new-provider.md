# Add new provider

## Scaffold with create-ai-provider (recommended)

Generate a repo-convention-complete package instead of hand-writing the boilerplate:

```bash
node tools/create-ai-provider/src/index.js <provider-name> --archetype openai-compatible
```

Archetypes: `openai-compatible` (default), `harness-acp` (agent harness profile), `full-custom` (`LanguageModelV3` skeleton). See `tools/create-ai-provider/README.md` for all options (`--models`, `--executable`, `--with-docs`, `--with-example`, `-y`, `--no-install`).

The tool wires the root `tsconfig.json` reference and install for you. Still manual afterwards: steps 3–5 below (changeset, example, docs prose), then `node tools/scripts/validate-structure.mjs`.

## `@ai-toolkit/<provider>` vs 3rd party package

Every provider is welcome to create a 3rd party package. We are happy to link to it from our documentation.

If you would prefer a 1st party `@ai-toolkit/<provider>` package, please create an issue first to discuss.

## Example

https://github.com/khulnasoft/ai-toolkit/pull/8136/files

## How

1. Create new folder `packages/<provider>`
2. Set version in `packages/<provider>/package.json` to `0.0.0`
3. Create changeset for new package with `major`
4. Add examples to `examples/ai-functions/src/*/<provider>.ts` depending on what model types the provider supports
5. Add documentation in `content/providers/01-ai-toolkit-providers/<last number + 10>-<provider>.mdx`

See also [providers.md](providers.md)

## When in pre-release mode

If `main` is set up to publish `beta` releases, no further action is necessary. Just make sure not to backport it to the `vX.Y` stable branch since it will result in an npm version conflict once we exit pre-release mode on `main`
