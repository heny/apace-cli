#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs-extra');
const glob = require('fast-glob');
const path = require('path');
const prompts = require('prompts');
const execa = require('execa');
const ora = require('ora');

const program = new Command();
const TEMPLATE_CDR_PATH = path.join(__dirname, './template');
const APP_NAME = 'apace-cli';

function registerCommand() {
  program.name('apace').usage('<command> [options]');

  program
    .option('-h, --help', '显示帮助', () => program.help())
    .option('-v, --version', '显示版本', showVersion)
    .action(function () {});

  program
    .command('init [name]')
    .description('初始化项目')
    .action((name) => {
      init(name);
    });

  program.parse(process.argv);
}

async function getLatestVersion(name) {
  const originInfo = await execa(`npm view ${name} --registry https://registry.npmjs.org/ --json`);
  return JSON.parse(originInfo.stdout)['dist-tags'].latest;
}

async function showVersion(show = true) {
  const spinner = ora('Loading...').start();
  const { version } = require('./package.json');
  let latestVersion = await getLatestVersion(APP_NAME);
  spinner.stop();

  if (show) console.log(version);
  if (latestVersion) {
    if (latestVersion !== version) {
      console.log(
        boxen(
          `available ${chalk.red(version)} → ${chalk.green(latestVersion)}.
use ${chalk.green('npm i -g apace-cli')} to install.`,
          {
            padding: 1,
            align: 'center',
            borderColor: 'yellow',
            title: 'Update',
            titleAlignment: 'center',
          }
        )
      );
    }
  }
}

async function init(name = '') {
  await showVersion(false);

  let templateList = getTemplateList();
  let { templateName, projectName = name } = await prompts(
    [
      {
        type: 'select',
        name: 'templateName',
        message: '请选择模板',
        choices: templateList.map((template) => ({ title: template, value: template })),
      },
      {
        type: () => (name ? null : 'text'),
        name: 'projectName',
        message: '请输入项目名称',
        validate: (value) => value.length > 0 || '项目名称不能为空',
      },
    ],
    { onCancel: () => process.exit(0) }
  );

  const templatePath = path.join(TEMPLATE_CDR_PATH, templateName);

  glob
    .sync(['*', '**'], {
      onlyFiles: false,
      dot: true,
      cwd: templatePath.replace(/\\/g, '/'),
    })
    .forEach((file) => {
      const filePath = path.join(templatePath, file);
      const targetPath = path.join(process.cwd(), projectName, file);
      fs.copySync(filePath, targetPath);
    });

  fs.writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify({ name: projectName, version: '0.0.1' })
  );

  console.log(`
    项目初始化完成，请进入项目安装依赖
        ${chalk.cyan(`cd ${projectName}`)}
        ${chalk.cyan('npm i')}
  `);
}

function getTemplateList() {
  const templateList = [];
  const templatePath = TEMPLATE_CDR_PATH;
  const files = fs.readdirSync(templatePath);
  files.forEach((file) => {
    const filePath = path.join(templatePath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      templateList.push(file);
    }
  });
  return templateList;
}

registerCommand();
