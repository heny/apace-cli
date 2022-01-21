import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { APP_NAME } from './common/constant';
import { getLatestVersion } from './utils';

import { registerCommand as init } from './init';

const program = new Command();

async function showVersion() {
  const { version } = require('@root/package.json');
  let latestVersion = await getLatestVersion(APP_NAME);

  console.log(version);
  if (latestVersion) {
    if (latestVersion !== version) {
      console.log(
        boxen(`available ${chalk.red(version)} → ${chalk.green(latestVersion)}.`, {
          padding: 1,
          align: 'center',
          borderColor: 'yellow',
          title: 'Update',
          titleAlignment: 'center',
        })
      );
    }
  }
}

function registerCommand() {
  program.name('apace').usage('<command> [options]');

  program
    .option('-h, --help', '显示帮助', () => program.help())
    .option('-v, --version', '显示版本', showVersion)
    .action(function () {});

  init(program);

  program.parse(process.argv);
}

registerCommand();
