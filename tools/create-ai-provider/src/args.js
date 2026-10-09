import { getAllArchetypes } from './templates/index.js';

export const ARCHETYPE_NAMES = [
  'openai-compatible',
  'harness-acp',
  'full-custom',
];

export function parseArgs(argv) {
  const options = {
    name: undefined,
    archetype: undefined,
    models: undefined,
    executable: undefined,
    withDocs: false,
    withExample: false,
    noInstall: false,
    skipPrompts: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('-')) {
      options.name = arg;
    } else if (arg === '--archetype' || arg === '-a') {
      options.archetype = argv[++i];
    } else if (arg.startsWith('--archetype=')) {
      options.archetype = arg.split('=')[1];
    } else if (arg === '--models' || arg === '-m') {
      options.models = argv[++i];
    } else if (arg.startsWith('--models=')) {
      options.models = arg.split('=')[1];
    } else if (arg === '--executable' || arg === '-e') {
      options.executable = argv[++i];
    } else if (arg.startsWith('--executable=')) {
      options.executable = arg.split('=')[1];
    } else if (arg === '--with-docs') {
      options.withDocs = true;
    } else if (arg === '--with-example') {
      options.withExample = true;
    } else if (arg === '--no-install') {
      options.noInstall = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.skipPrompts = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  if (!options.name && !options.help) {
    throw new Error(
      'Provider name is required. Run create-ai-provider --help for usage.',
    );
  }

  return options;
}

export function validateArgs(options) {
  if (options.name && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.name)) {
    throw new Error(
      `Invalid provider name "${options.name}". Use stable kebab-case (e.g. "my-provider").`,
    );
  }

  if (options.archetype && !ARCHETYPE_NAMES.includes(options.archetype)) {
    throw new Error(
      `Unknown archetype "${options.archetype}". Use: ${ARCHETYPE_NAMES.join(', ')}`,
    );
  }

  return options;
}

export function getArchetypeChoices() {
  return getAllArchetypes().map(a => ({
    name: a.name,
    description: a.description,
  }));
}
