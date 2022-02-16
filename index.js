#!/usr/bin/env node
const { Command } = require('commander')
const chalk = require('chalk')
const boxen = require('boxen')
const fs = require('fs-extra')
const path = require('path')
const prompts = require('prompts')
const execa = require('execa')
const ora = require('ora')
const downloadRepo = require('download-git-repo')

const program = new Command()
const APP_NAME = 'apace-cli'

const templateList = [
  {
    title: 'vue3-ts',
    value: 'template-vue3-ts',
  },
  {
    title: 'vue3',
    value: 'template-vue3',
  },
]

function downloadRepoSync(repo, dest, options = {}) {
  return new Promise((resolve, reject) => {
    downloadRepo(repo, dest, options, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

function registerCommand() {
  program.name('apace').usage('<command> [options]')

  program
    .option('-h, --help', '显示帮助', () => program.help())
    .option('-v, --version', '显示版本', showVersion)
    .option('-y, --yes', '自动安装依赖')
    .action(function () {})

  program
    .command('init [name]')
    .description('初始化项目')
    .action((name) => {
      init(name)
    })

  program.parse(process.argv)
}

async function getLatestVersion(name) {
  const originInfo = await execa(`npm view ${name} --registry https://registry.npmjs.org/ --json`)
  return JSON.parse(originInfo.stdout)['dist-tags'].latest
}

async function showVersion(show = true) {
  const spinner = ora('Loading...').start()
  const { version } = require('./package.json')
  let latestVersion = await getLatestVersion(APP_NAME)
  spinner.stop()

  if (show) console.log(version)
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
      )
    }
  }
}

async function init(name = '') {
  let { templateName, projectName = name } = await prompts(
    [
      {
        type: 'select',
        name: 'templateName',
        message: '请选择模板',
        choices: templateList,
      },
      {
        type: () => (name ? null : 'text'),
        name: 'projectName',
        message: '请输入项目名称',
        validate: (value) => value.length > 0 || '项目名称不能为空',
      },
    ],
    { onCancel: () => process.exit(0) }
  )

  const spinner = ora('Downloading...').start()
  try {
    await downloadRepoSync(`heny/${templateName}`, projectName)
  } catch (err) {
    spinner.fail()
    console.log(err)
    console.log(chalk.red('下载模板失败，请重新尝试！'))
    process.exit(0)
  } finally {
    spinner.stop()
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), projectName, 'package.json'))
  )

  fs.writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify({ ...packageJson, name: projectName, version: '0.0.1' }, null, 2)
  )

  console.log(`
    项目初始化完成，请进入项目安装依赖
        ${chalk.cyan(`cd ${projectName}`)}
        ${chalk.cyan('npm i')}
  `)
}

registerCommand()
