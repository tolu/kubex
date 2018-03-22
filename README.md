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

      -V, --version     output the version number
      -d, --debug       verbose output
      -h, --help        output usage information

    Commands:

      set-context|ctx   select kubectl context
      set-namespace|ns  select kubectl namespace
```

### What it looks like
Notice that the current context/namespace is the default selected option

![image](https://user-images.githubusercontent.com/658586/37755278-23fa7a78-2da5-11e8-9b35-d1c031ae105e.png)


![image](https://user-images.githubusercontent.com/658586/37755299-3a1323be-2da5-11e8-8bd1-2e4f310f902c.png)

## Dependencies

 - [commander](https://www.npmjs.com/package/commander) - solution for building node.js cli
 - [inquirer](https://www.npmjs.com/package/inquirer) - interactive cli lists
 - [clui](https://www.npmjs.com/package/clui) - cli spinner

## Inspiration

 - https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
 - https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

## License

MIT @ https://tolu.mit-license.org/
