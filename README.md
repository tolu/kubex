[![npm version](https://badge.fury.io/js/kubex.svg)](https://www.npmjs.com/package/kubex) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://tolu.mit-license.org/)

# kubex
Interactive cli helper for kubectl

> Tired of listing all alternatives just to be able to switch context or namespace - then this is for you

You'll need to have [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed in path

## Install

```
$ npm i -g kubex
```

## Usage

```
$ kubex -h

  Usage: kubex [command] [options]

  Interactive <kubectl> helper

  Options:

    -v, --version     output the version number
    -h, --help        output usage information

  Commands:

    set-context|ctx   select kubectl context
    set-namespace|ns  select kubectl namespace
    set-image|si      set image for deployment
    interactive|i     Choose command from list
```

### What it looks like
Notice that when selecting context/namespace, the current one is the default selected option

![select subscription](./gifs/kubex-example.gif)


## Dependencies

 - [commander](https://www.npmjs.com/package/commander) - solution for building node.js cli
 - [inquirer](https://www.npmjs.com/package/inquirer) - interactive cli prompts
 - [clui](https://www.npmjs.com/package/clui) - cli spinner etc.
 - [execa](https://www.npmjs.com/package/execa) - a better `child_process`

## Inspiration

 - https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
 - https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

## License

MIT @ https://tolu.mit-license.org/
