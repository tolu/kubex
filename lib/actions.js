const {prompt} = require('inquirer');
const {showLoader, hideLoader} = require('./loading');
const kubectl = require('./kubectl');

const setContext = async () => {
  showLoader('Fetching contexts...');
  const contexts = await kubectl.getContexts();
  hideLoader();
  prompt([{
    type: 'list',
    name: 'context',
    message: `Select kubectl context`,
    choices: contexts.names,
    default: contexts.current
  }])
    .then(({context}) => {
      kubectl.setContext(context);
    });
};

const setNamespace = async () => {
  showLoader('Fetching namespaces...');
  const [namespaces, contexts] = await Promise.all([
    kubectl.getNamespaces(),
    kubectl.getContexts()
  ]);
  hideLoader();
  prompt([{
    type: 'list',
    name: 'namespace',
    message: `Select namespace for context: "${contexts.current}"`,
    choices: namespaces,
    default: contexts.namespace[contexts.names.indexOf(contexts.current)]
  }]).then(({namespace}) => {
    kubectl.setNamespace(contexts.current, namespace);
  });
};

const setImage = async () => {
  showLoader('Fetching deployments...');
  const deployments = await kubectl.getDeployments();
  hideLoader();
  // Select deployment to work magic on
  const {deployment} = await prompt({
    type: 'list',
    name: 'deployment',
    message: `Select deployment to edit`,
    choices: deployments
  });
  console.log(`Current image:\n\t${deployment.image}`);
  const [image, currentTag] = deployment.image.split(':');

  // Take tag via input
  const {tag} = await prompt({
    type: 'input',
    name: 'tag',
    message: `Type tag to set`,
    choices: deployments
  });

    // "are you sure"
  if (await areYouSure(`Change tag from ${currentTag} to ${tag}`)) {
    // Set image
    console.log('setting image...');
    await kubectl.setImage(deployment.name, deployment.container, image, tag);
  }
};

const runCommand = async program => {
  const commands = program.commands
    .filter(c => c._name !== 'interactive')
    .map(c => ({
      name: c._name,
      value: `command:${c._name}`
    }));
  const {command} = await prompt([{
    type: 'list',
    name: 'command',
    message: `Select command to run`,
    choices: commands
  }]);
  program.emit(command);
};

async function areYouSure(message) {
  // @ts-ignore
  const {yesOrNo} = await prompt({
    type: 'list',
    name: 'yesOrNo',
    message,
    choices: [
      {name: 'No', value: false},
      {name: 'Yes', value: true}
    ]
  });
  return yesOrNo;
}

module.exports = {
  setContext,
  setNamespace,
  setImage,
  runCommand
};
