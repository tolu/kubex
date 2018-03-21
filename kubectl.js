const { spawn } = require('child_process');

/**
 * @returns {Promise<string[]>}
 */
const getNamespaces = async () => {
  const stdout = await execFn(['get', 'namespaces', '-o', 'json'])
  // parse output to array of contexts
  return JSON.parse(stdout).items.map((i) => i.metadata.name)
}

/**
 * @returns {Promise<string[]>}
 */
const getContexts = () => {
  return new Promise(async (resolve) => {

    const stdout = await execFn(['config', 'get-contexts']);
    // parse output to array of contexts
    const contexts = []
    stdout.split('\n').filter(empty).map((line, idx) => {
      // [current, name, cluster, authInfo, namespace]
      const values = line.trim().replace(/(\*?\s)+/g, ',').split(',').filter(empty)
      if(idx > 0) {
        // if line starts with '*', this is the current one - add to back of name
        contexts.push(values[0]); // (/^\*/.test(line) ? ' (*)' : '')
      }
    })
    resolve(contexts);
  })
}

function execFn (args) {
  let response = '';
  return new Promise((resolve, reject) => {
    // console.log(`Spawn: "kubectl ${args.join(' ')}"`)
    const p = spawn('kubectl', args);
    p.stderr.on('data', reject);
    p.stdout.on('data', (data) => response+=data);
    p.on('close', (code) => resolve(response.trim()));
  })
}

function empty(str) {
  return Boolean(str.length);
}

module.exports = {
  getNamespaces,
  getContexts,
  execFn
}
