import chalk from 'chalk';

export class UI {
  boxStart(title, version) {
    const label = version ? `${title}  ${chalk.dim(`v${version}`)}` : title;
    console.log(chalk.dim('┌') + '  ' + label);
    console.log(chalk.dim('│'));
  }

  boxEnd() {
    console.log(chalk.dim('└') + '  Done');
  }

  log(message) {
    console.log(chalk.dim('│') + '  ' + message);
  }

  success(message) {
    console.log(chalk.dim('│') + chalk.green('  ✓') + ' ' + message);
  }

  warn(message) {
    console.warn(chalk.dim('│') + chalk.yellow('  ▲') + ' ' + message);
  }

  error(message) {
    console.error(chalk.dim('│') + chalk.red('  ✗') + ' ' + message);
  }

  divider() {
    console.log(chalk.dim('│'));
  }

  prompt(question) {
    console.log(chalk.dim('│') + chalk.cyan('  ◇') + '  ' + question);
  }

  promptSelected(answer) {
    console.log(chalk.dim('│') + '    ' + chalk.green('●') + ' ' + answer);
  }

  promptUnselected(answer) {
    console.log(chalk.dim('│') + '    ' + chalk.dim('○') + ' ' + answer);
  }

  option(answer) {
    console.log(chalk.dim('│') + '  ' + answer);
  }

  highlight(message) {
    console.log(chalk.dim('│') + chalk.cyan('  ◆') + '  ' + message);
  }
}

export const ui = new UI();

export const logger = {
  info(message) {
    console.log(chalk.dim('│') + '  ℹ' + ' ' + message);
  },

  success(message) {
    console.log(chalk.dim('│') + chalk.green('  ✓') + ' ' + message);
  },

  warn(message) {
    console.warn(chalk.dim('│') + chalk.yellow('  ▲') + ' ' + message);
  },

  error(message) {
    console.error(chalk.dim('│') + chalk.red('  ✗') + ' ' + message);
  },

  header(message) {
    console.log(`\n${chalk.blue(message)}`);
  },

  subheader(message) {
    console.log(`${chalk.dim(message)}`);
  },
};

export { chalk };
