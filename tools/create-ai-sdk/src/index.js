#!/usr/bin/env node

import { createAIProject } from './create.js';
import { parseArgs } from './args.js';
import { ui, logger, chalk } from './logger.js';

const main = async () => {
  const args = parseArgs(process.argv);

  if (args.help) {
    ui.boxStart('create-ai-sdk');
    ui.log('');
    ui.log(chalk.bold('Usage:'));
    ui.log(`  ${chalk.cyan('create-ai-sdk <project-name>')} ${chalk.dim('[options]')}`);
    ui.divider();
    ui.log(chalk.bold('Options:'));
    ui.log(
      `  ${chalk.cyan('--template <name>')}    Template (next-react, next-rsc, vite-react, vue, svelte, node)`,
    );
    ui.log(
      `  ${chalk.cyan('--provider <name>')}     AI provider (openai, anthropic, google, azure, bedrock)`,
    );
    ui.log(`  ${chalk.cyan('--no-install')}          Skip dependency installation`);
    ui.log(`  ${chalk.cyan('-y, --yes')}             Skip prompts and use defaults`);
    ui.log(`  ${chalk.cyan('-h, --help')}            Show this help message`);
    ui.divider();
    ui.log(chalk.bold('Examples:'));
    ui.log(`  ${chalk.dim('$')} create-ai-sdk my-chat-app`);
    ui.log(`  ${chalk.dim('$')} create-ai-sdk my-app --template next-react --provider openai`);
    ui.log(`  ${chalk.dim('$')} create-ai-sdk my-app -y --no-install`);
    ui.boxEnd();
    process.exit(0);
  }

  const { name, template, provider, noInstall, skipPrompts } = args;

  try {
    await createAIProject({
      name,
      template: template || (skipPrompts ? 'next-react' : undefined),
      provider: provider || (skipPrompts ? 'openai' : undefined),
      install: !noInstall,
      interactive: !skipPrompts,
    });
  } catch (error) {
    ui.error(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
};

main();
