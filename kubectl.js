const execa = require('execa');

/**
 * @returns {Promise<string[]>}
 */
const getDeployments = async () => {
  const stdout = await execFn(['get', 'deployments', '-o', 'json']);
  // Parse output to array of contexts
  return JSON.parse(stdout).items.map(i => ({
    name: i.metadata.name,
    value: {
      name: i.metadata.name,
      container: i.spec.template.spec.containers[0].name,
      image: i.spec.template.spec.containers[0].image
    }
  }));
};

/**
 * @returns {Promise<string[]>}
 */
const getNamespaces = async () => {
  const stdout = await execFn(['get', 'namespaces', '-o', 'json']);
  // Parse output to array of contexts
  return JSON.parse(stdout).items.map(i => i.metadata.name);
};

/**
 * @returns {Promise<string>}
 */
const getCurrentContext = () => {
  return execFn(['config', 'current-context']);
};

/**
 * @typedef ClusterInfo
 * @prop {string[]} names
 * @prop {string[]} cluster
 * @prop {string[]} namespace
 * @prop {string?} current
*/
/**
 * @returns {Promise<ClusterInfo>}
 */
const getContexts = () => {
  return new Promise(async resolve => {
    const stdout = await execFn(['config', 'get-contexts']);
    // Parse output to array of contexts
    const contextInfo = {
      names: [],
      cluster: [],
      namespace: [],
      current: null
    };
    stdout.split('\n').filter(empty).forEach((line, idx) => {
      // [current, name, cluster, authInfo, namespace]
      const values = line.trim().replace(/(\*?\s)+/g, ',').split(',').filter(empty);
      // [name, cluster, authInfo, namespace]
      if (idx > 0) {
        contextInfo.names.push(values[0]);
        contextInfo.cluster.push(values[1]);
        contextInfo.namespace.push(values[3]);
        if (/^\*/.test(line)) { // Current ctx line starts with '*'
          contextInfo.current = values[0];
        }
      }
    });
    resolve(contextInfo);
  });
};

const setImage = async (deployment, container, image, tag) => {
  const result = await execFn(
    ['set', 'image', `deployment/${deployment}`, `${container}=${image}:${tag}`]
  );
  console.log(result);
};

const setContext = async context => {
  const result = await execFn(['config', 'use-context', context]);
  console.log(result);
};

const setNamespace = async (context, namespace) => {
  const result = await execFn(['config', 'set-context', context, `--namespace=${namespace}`]);
  console.log(result);
};

function execFn(args) {
  return execa.stdout('kubectl', args);
}

function empty(str) {
  return Boolean(str.length);
}

module.exports = {
  getCurrentContext,
  getDeployments,
  getNamespaces,
  getContexts,
  setNamespace,
  setContext,
  setImage
};
