import { z } from 'zod/v4';

/**
 * How to acquire the ACP implementation inside the sandbox.
 *
 * - `npm-simple`: install a single package by name (optionally pinned).
 * - `npm-locked`: install with `pnpm install --frozen-lockfile` from the
 *   supplied manifest + lockfile.
 * - `install-command`: run a trusted Bash command in the deterministic
 *   bootstrap directory (must install `executable` into `$HOME/.local/bin`).
 */
export const acpNpmSimpleSourceSchema = z.object({
  type: z.literal('npm-simple'),
  packageName: z.string(),
  packageVersion: z.string().optional(),
});

export const acpNpmLockedSourceSchema = z.object({
  type: z.literal('npm-locked'),
  packageJson: z.string(),
  pnpmLockYaml: z.string(),
  pnpmWorkspaceYaml: z.string().optional(),
});

export const acpInstallCommandSourceSchema = z.object({
  type: z.literal('install-command'),
  command: z.string(),
});

export const acpSourceSchema = z.union([
  acpNpmSimpleSourceSchema,
  acpNpmLockedSourceSchema,
  acpInstallCommandSourceSchema,
]);

export type ACPNpmSimpleSource = z.infer<typeof acpNpmSimpleSourceSchema>;
export type ACPNpmLockedSource = z.infer<typeof acpNpmLockedSourceSchema>;
export type ACPInstallCommandSource = z.infer<
  typeof acpInstallCommandSourceSchema
>;
export type ACPSource = z.infer<typeof acpSourceSchema>;

/**
 * Stable identity fragment for a source. An omitted `packageVersion`
 * stays out of the identity so a new upstream `latest` does not
 * invalidate cached lifecycle state.
 */
export function getSourceIdentity(source: ACPSource): string {
  switch (source.type) {
    case 'npm-simple':
      return source.packageVersion != null
        ? `${source.packageName}@${source.packageVersion}`
        : source.packageName;
    case 'npm-locked':
      return `locked:${hashString(
        `${source.packageJson}\n---\n${source.pnpmLockYaml}\n---\n${source.pnpmWorkspaceYaml ?? ''}`,
      )}`;
    case 'install-command':
      return `cmd:${hashString(source.command)}`;
  }
}

function hashString(value: string): string {
  // FNV-1a 32-bit — deterministic, dependency-free, runtime-neutral.
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}
