const program = require('commander');
// @ts-ignore
const version = require('../package.json').version;

const {
  setContext,
  setNamespace,
  setImage,
  runCommand
} = require('./actions');

program.name('kubex');

program
  .version(version, '-v, --version')
  .usage('[command] [options]')
  .description('Interactive <kubectl> helper');

program
  .command('set-context')
  .description('select kubectl context')
  .alias('ctx')
  .action(setContext);

program
  .command('set-namespace')
  .description('select kubectl namespace')
  .alias('ns')
  .action(setNamespace);

program
  .command('set-image')
  .description('set image for deployment')
  .alias('si')
  .action(setImage);

program
  .command('interactive')
  .description('Choose command from list')
  .alias('i')
  .action(() => runCommand(program));

program.parse(process.argv);

// Default to showing help
if (program.args.length === 0) {
  program.help();
}
