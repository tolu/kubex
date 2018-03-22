#!/usr/bin/env node

const program = require('commander');
const { showLoader, hideLoader } = require('./loading');
const {prompt} = require('inquirer');
const {
  getContexts,
  getNamespaces,
  getDeployments,
  setNamespace,
  setContext,
  setImage
} = require('./kubectl');
// @ts-ignore
const version = require('./package.json').version;

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
    showLoader('Fetching contexts...');
    const contexts = await getContexts();
    hideLoader();
    prompt([{
      type: 'list',
      name: 'context',
      message: `Select kubectl context`,
      choices: contexts.names,
      default: contexts.current
    }])
      .then(({context}) => {
        setContext(context);
      });
  });

program
  .command('set-namespace')
  .description('select kubectl namespace')
  .alias('ns')
  .action(async () => {
    showLoader('Fetching namespaces...');
    const [namespaces, contexts] = await Promise.all([
      getNamespaces(),
      getContexts()
    ]);
    hideLoader();
    prompt([{
      type: 'list',
      name: 'namespace',
      message: `Select namespace for context: "${contexts.current}"`,
      choices: namespaces,
      default: contexts.namespace[contexts.names.indexOf(contexts.current)]
    }]).then(({namespace}) => {
      setNamespace(contexts.current, namespace);
    });
  });

program
  .command('set-image')
  .description('set image for deployment')
  .alias('si')
  .action(async () => {
    showLoader('Fetching deployments...')
    const deployments = await getDeployments();
    hideLoader();
    // select deployment to work magic on
    const {deployment} = await prompt({
      type: 'list',
      name: 'deployment',
      message: `Select deployment to edit`,
      choices: deployments
    });
    console.log(`Current image:\n\t${deployment.image}`);
    const [image, currentTag] = deployment.image.split(':');

    // take tag via input
    const {tag} = await prompt({
      type: 'input',
      name: 'tag',
      message: `Type tag to set`,
      choices: deployments
    });

    // "are you sure"
    if(await areYouSure(`Change tag from ${currentTag} to ${tag}`)){
      // set image
      console.log('setting image...')
      await setImage(deployment.name, deployment.container, image, tag);
    }
  });

program.parse(process.argv);

// Default to showing help
if (program.args.length === 0) {
  program.help();
}

async function areYouSure(message){
  // @ts-ignore
  const {yesOrNo} = await prompt({
    type: 'list',
    name: 'yesOrNo',
    message,
    choices: [
      { name: 'No', value: false },
      { name: 'Yes', value: true }
    ]
  });
  return yesOrNo;
}
