import { Command } from 'commander';
import fs from 'fs-extra';
import glob from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { TEMPLATE_CDR_PATH } from './common/constant';

export function registerCommand(program: Command) {
  program
    .command('init [name]')
    .description('初始化项目')
    .action((name) => {
      init(name);
    });
}

async function init(name = '') {
  let templateList = getTemplateList();
  console.log(name, 'name');
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
  const templateList: string[] = [];
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
