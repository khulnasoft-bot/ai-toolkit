export function parseArgs(argv) {
  const options = {
    name: undefined,
    template: undefined,
    provider: undefined,
    noInstall: false,
    skipPrompts: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('-')) {
      options.name = arg;
    } else if (arg === '--template' || arg === '-t') {
      options.template = argv[++i];
    } else if (arg === '--provider' || arg === '-p') {
      options.provider = argv[++i];
    } else if (arg === '--no-install') {
      options.noInstall = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.skipPrompts = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  if (!options.name && !options.help) {
    throw new Error('Project name is required. Run create-ai-sdk --help for usage.');
  }

  return options;
}

export function validateArgs(options) {
  const validTemplates = ['next-react', 'next-rsc', 'vite-react', 'vue', 'svelte', 'node'];

  const validProviders = ['openai', 'anthropic', 'google', 'azure', 'bedrock'];

  if (options.template && !validTemplates.includes(options.template)) {
    throw new Error(`Invalid template: ${options.template}. Valid: ${validTemplates.join(', ')}`);
  }

  if (options.provider && !validProviders.includes(options.provider)) {
    throw new Error(`Invalid provider: ${options.provider}. Valid: ${validProviders.join(', ')}`);
  }

  return true;
}
