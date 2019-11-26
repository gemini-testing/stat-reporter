# stat-reporter

[![npm](https://img.shields.io/npm/v/stat-reporter.svg)](https://www.npmjs.com/package/stat-reporter)
[![Build Status](https://travis-ci.org/gemini-testing/stat-reporter.svg?branch=master)](https://travis-ci.org/gemini-testing/stat-reporter)

Plugin for [hermione](https://github.com/gemini-testing/hermione) which allows to collect and provide test statistic for each of used browsers.

You can read more about hermione plugins [here](https://github.com/gemini-testing/hermione#plugins).

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

## Additional commands

Additional commands that are added to the tool for which this plugin is connected.

### merge-stat-reports

Command that adds ability to merge reports which are created after running the tests.

**Attention!** This plugin works only for Hermione

Example of usage:
```
npx hermione merge-stat-reports src-report-1.json src-report-2.json --html dest-html-report --json report.json
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
