#!/usr/bin/env node

import { createProviderPackage } from './create.js';
import { parseArgs, validateArgs } from './args.js';
import { ui, chalk } from './logger.js';

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    ui.boxStart('create-ai-provider');
    ui.log('');
    ui.log(chalk.bold('Usage:'));
    ui.log(
      `  ${chalk.cyan('create-ai-provider <provider-name>')} ${chalk.dim('[options]')}`,
    );
    ui.divider();
    ui.log(chalk.bold('Options:'));
    ui.log(
      `  ${chalk.cyan('--archetype, -a <name>')}  openai-compatible (default), harness-acp, full-custom`,
    );
    ui.log(
      `  ${chalk.cyan('--models, -m <list>')}     Comma-separated model ids (openai-compatible)`,
    );
    ui.log(
      `  ${chalk.cyan('--executable, -e <cmd>')}  CLI command (harness-acp, e.g. "my-agent --acp")`,
    );
    ui.log(
      `  ${chalk.cyan('--with-docs')}          Emit docs page stubs (canonical + site mirror)`,
    );
    ui.log(
      `  ${chalk.cyan('--with-example')}       Emit example stub under examples/04-tools`,
    );
    ui.log(
      `  ${chalk.cyan('--no-install')}          Skip dependency installation`,
    );
    ui.log(
      `  ${chalk.cyan('-y, --yes')}             Skip prompts and use defaults`,
    );
    ui.log(`  ${chalk.cyan('-h, --help')}            Show this help message`);
    ui.divider();
    ui.log(chalk.bold('Examples:'));
    ui.log(`  ${chalk.dim('$')} create-ai-provider my-provider`);
    ui.log(
      `  ${chalk.dim('$')} create-ai-provider my-agent -a harness-acp -e "my-agent --acp"`,
    );
    ui.log(
      `  ${chalk.dim('$')} create-ai-provider my-provider -y --no-install --with-docs`,
    );
    ui.boxEnd();
    process.exit(0);
  }

  validateArgs(args);

  const { name, archetype, models, executable, withDocs, withExample } = args;

  try {
    await createProviderPackage({
      name,
      archetype:
        archetype || (args.skipPrompts ? 'openai-compatible' : undefined),
      models: models
        ? models
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : undefined,
      executable,
      withDocs,
      withExample,
      install: !args.noInstall,
      interactive: !args.skipPrompts,
    });
  } catch (error) {
    ui.error(`Failed to create provider: ${error.message}`);
    process.exit(1);
  }
};

main();
