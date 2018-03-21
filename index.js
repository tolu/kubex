#!/usr/bin/env node

const program = require('commander');
const {Spinner} = require('clui');
const { prompt } = require('inquirer');
const { getContexts, getNamespaces, execFn } = require('./kubectl');

const spinner = new Spinner('...');

program.name('kubex')

program
  .version('0.0.1')
  .usage('[command] [options]')
  .option('-d, --debug', 'verbose output', false)
  .description('Interactive <kubectl> helper');

program
  .command('set-context')
  .description('select kubectl context')
  .alias('ctx')
  .action(async () => {
    spinner.start();
    const [contexts, currentContext] = await Promise.all([
      getContexts(),
      execFn(['config', 'current-context'])
    ]);
    spinner.stop();
    prompt([{
      type : 'list',
      name : 'context',
      message : `Select kubectl context (current: "${currentContext}")`,
      choices: contexts
    }])
    .then(({context}) => {
      execFn(['config', 'use-context', context])
      .then(console.log);
    });
  });

program
  .command('set-namespace')
  .description('select kubectl namespace')
  .alias('ns')
  .action(async () => {
    const [namespaces, currentContext] = await Promise.all([
      getNamespaces(),
      execFn(['config', 'current-context'])
    ]);
    prompt([{
      type : 'list',
      name : 'namespace',
      message : 'Select namespace',
      choices: namespaces
    }]).then(({namespace}) => {
      execFn(['config', 'set-context', currentContext, `--namespace=${namespace}`])
      .then(console.log);
    });
  });

program
  .command('foo')
  .description('test command')
  .alias('f')
  .action(() => {
    spinner.start();
    setTimeout(() => {
      spinner.stop();
      console.log(program.opts())
    }, 1500);
  });

program.parse(process.argv)

if (!program.args.length) program.help();