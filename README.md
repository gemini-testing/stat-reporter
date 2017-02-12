# stat-reporter

[![npm](https://img.shields.io/npm/v/stat-reporter.svg)](https://www.npmjs.com/package/stat-reporter)
[![Build Status](https://travis-ci.org/gemini-testing/stat-reporter.svg?branch=master)](https://travis-ci.org/gemini-testing/stat-reporter)
[![Coverage Status](https://img.shields.io/coveralls/gemini-testing/stat-reporter.svg?style=flat)](https://coveralls.io/r/gemini-testing/stat-reporter?branch=master)

Common plugin for:

* [gemini](https://github.com/gemini-testing/gemini)
* [hermione](https://github.com/gemini-testing/hermione)

which allows to collect and provide test statistic for each of used browsers.

You can read more about gemini plugins [here](https://github.com/gemini-testing/gemini/blob/master/doc/plugins.md)
and hermione plugins [here](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
npm install stat-reporter
```

## Usage

Plugin has following configuration:

* **enabled** (optional) `Boolean` – enable/disable the plugin; by default plugin is enabled
* **reporters** (optional) `Object` - the list of statistic reporters
    * **flat** (optional) `Object` - flat (console) reporter configuration
        * **enabled** (optional) `Boolean` - enable/disable the flat reporter; by default reporter is enabled
    * **html** (optional) `Object` - html reporter configuration
        * **enabled** (optional) `Boolean` - enable/disable the html reporter; by default reporter is disabled
        * **path** (optional) `String` - path for saving html report file; by default html report will be saved into `stat-reporter.html` inside current work directory.
    * **json** (optional) `Object` - json reporter configuration
        * **enabled** (optional) `Boolean` - enable/disable the json reporter; by default reporter is disabled
        * **path** (optional) `String` - path for saving json report file; by default json report will be saved into `stat-reporter.json` inside current work directory.

Also there is ability to override plugin parameters by CLI options or environment variables
(see [configparser](https://github.com/gemini-testing/configparser)).

### Gemini usage

Add plugin to your `gemini` config file:

```yaml
system:
  plugins:
    stat-reporter/gemini:
      enabled: true
```

Also reporter settings can be set explicitly:

```yaml
system:
  plugins:
    stat-reporter/gemini:
      enabled: true
      reporters:
        flat:
          enabled: false
        html:
          enabled: true
          path: my/custom/report.html
```

### Hermione usage

Add plugin to your `hermione` config file:

```js
module.exports = {
    // ...
    plugins: {
        'stat-reporter/hermione': {
            enabled: true
        }
    },

    // ...
};
```

## Testing

Run [mocha](http://mochajs.org) tests:
```bash
npm run test-unit
```

Run tests with [istanbul](https://github.com/gotwarlost/istanbul) coverage calculation:
```bash
npm run cover
```

Run [eslint](http://eslint.org) codestyle verification
```bash
npm run lint
```

Special thanks to:

* Eugene Konstantinov [sipayRT](https://github.com/sipayRT)
* Dmitriy Dudkevich [DudaGod](https://github.com/DudaGod)
* Anton Usmansky [j0tunn](https://github.com/j0tunn)
* Rostislav Shtanko [rostik404](https://github.com/rostik404)
* Evgeniy Gavryushin [eGavr](https://github.com/eGavr)
