#!/usr/bin/env node

const program = require('commander');
const {Spinner} = require('clui');
const {prompt} = require('inquirer');
const {
  getContexts,
  getNamespaces,
  execFn
} = require('./kubectl');
// @ts-ignore
const version = require('./package.json').version;

const spinner = new Spinner('...');

program.name('kubex');

program
  .version(version, '-v, --version')
  .usage('[command] [options]')
  .option('-d, --debug', 'verbose output', false)
  .description('Interactive <kubectl> helper');

program
  .command('set-context')
  .description('select kubectl context')
  .alias('ctx')
  .action(async () => {
    spinner.start();
    const contexts = await getContexts();
    spinner.stop();
    prompt([{
      type: 'list',
      name: 'context',
      message: `Select kubectl context`,
      choices: contexts.names,
      default: contexts.current
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
    spinner.start();
    const [namespaces, contexts] = await Promise.all([
      getNamespaces(),
      getContexts()
    ]);
    spinner.stop();
    prompt([{
      type: 'list',
      name: 'namespace',
      message: 'Select namespace',
      choices: namespaces,
      default: contexts.namespace[contexts.names.indexOf(contexts.current)]
    }]).then(({namespace}) => {
      execFn(['config', 'set-context', contexts.current, `--namespace=${namespace}`])
        .then(console.log);
    });
  });

console.log(process.env);

program.parse(process.argv);

// Default to showing help
if (program.args.length === 0) {
  program.help();
}
