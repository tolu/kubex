# kubex
Interactive cli helper for kubectl

> Tired of listing all alternatives just to be able to switch context or namespace - then this is for you

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
`$ kubex ctx`  
![image](https://user-images.githubusercontent.com/658586/37714489-ef0a8a78-2d19-11e8-9f57-06c457bc8887.png)

`$ kubex ns`  
![image](https://user-images.githubusercontent.com/658586/37714526-058211f4-2d1a-11e8-8bf8-16d493f053fc.png)

## Dependencies

 - [commander](https://www.npmjs.com/package/commander) - solution for building node.js cli
 - [inquirer](https://www.npmjs.com/package/inquirer) - interactive cli lists
 - [clui](https://www.npmjs.com/package/clui) - cli spinner

## Inspiration

 - https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
 - https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

## License

MIT @ https://tolu.mit-license.org/
