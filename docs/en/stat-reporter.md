# stat-reporter

## Overview

Use the `stat-reporter` plugin to get a report(s) with test run statistics in [hermione][hermione].

The plugin allows you to receive a report both in the console and as an html and/or json file. At the same time, the reports are not mutually exclusive: after running the tests, you can get 3 types of reports at once.

### Report format

In the plugin report, the test run results are split by browsers. The maximum execution time _(Duration)_ in minutes and seconds and the result of running tests _(Status)_ in each browser are also displayed. Such a report allows you to understand which browsers have problems: the most tests do not pass or the execution time has increased dramatically.

By default, only the report in the console is enabled:

```bash
┌──────────────────────┬────────┬───────┬────────┬────────┬─────────┬─────────┬──────────┐
│ Browser              │ Status │ Tests │ Passed │ Failed │ Skipped │ Retries │ Duration │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ firefox              │ passed │ 25    │ 24     │ 0      │ 1       │ 0       │ 01:02    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ chrome-desktop       │ passed │ 466   │ 464    │ 0      │ 2       │ 4       │ 07:40    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ ipad                 │ passed │ 24    │ 23     │ 0      │ 1       │ 0       │ 01:27    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ iphone               │ passed │ 376   │ 372    │ 0      │ 4       │ 7       │ 07:12    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ chrome-phone         │ passed │ 427   │ 421    │ 0      │ 6       │ 14      │ 07:32    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ iphone-dark          │ passed │ 74    │ 72     │ 0      │ 2       │ 4       │ 02:18    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ searchapp-phone      │ passed │ 319   │ 317    │ 0      │ 2       │ 9       │ 10:00    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ safari13             │ passed │ 15    │ 13     │ 0      │ 2       │ 4       │ 02:42    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ chrome-desktop-1920  │ passed │ 3     │ 3      │ 0      │ 0       │ 0       │ 00:57    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ iphoneX              │ passed │ 3     │ 3      │ 0      │ 0       │ 0       │ 00:36    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ chrome-desktop-dark  │ passed │ 77    │ 77     │ 0      │ 0       │ 5       │ 01:33    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ yandex-browser-phone │ passed │ 1     │ 1      │ 0      │ 0       │ 0       │ 00:28    │
├──────────────────────┼────────┼───────┼────────┼────────┼─────────┼─────────┼──────────┤
│ chrome-grid-720      │ passed │ 2     │ 2      │ 0      │ 0       │ 0       │ 00:49    │
└──────────────────────┴────────┴───────┴────────┴────────┴─────────┴─────────┴──────────┘
```

_If you want to get more functionality, then use [html-reporter][html-reporter] to get a test run report._

## Install

```bash
npm install -D stat-reporter
```

## Setup

Add the plugin to the `plugins` section of the `hermione` config:

### Minimum config

```javascript
module.exports = {
    plugins: {
        'stat-reporter': {
            enabled: true
            // the report will only be in the console
        },

        // other hermione plugins...
    },

    // other hermione settings...
};
```

### Maximum config

```javascript
module.exports = {
    plugins: {
        'stat-reporter': {
            enabled: true,
            reporters: {
                flat: {
                    enabled: true
                },
                html: {
                    enabled: true,
                    path: 'some/path/to/file.html'
                    // if you do not specify path, the report will be saved
                    // in stat-reporter.html in the current working directory
                },
                json: {
                    enabled: true,
                    path: 'some/path/to/file.json'
                    // if you do not specify path, the report will be saved
                    // in stat-reporter.json in the current working directory
                }
            }
        },

        // other hermione plugins...
    },

    // other hermione settings...
};
```

### Description of configuration parameters

| **Parameter** | **Type** | **Default&nbsp;value** | **Description** |
| ------------- | -------- | ---------------------- | --------------- |
| [enabled](#enabled) | Boolean | true | Enable / disable the plugin. |
| [reporters](#reporters) | Object | _see&nbsp;description_ | Settings for reports with test run statistics. By default, only the report in the console is enabled _(flat)_. |

### enabled

Enable or disable the plugin. By default: `true`.

### reporters

Optional parameter. Sets the settings for reports with test run statistics.

By default:

```javascript
{
    // the statistics report will only be in the console
    flat: {
        enabled: true
    }
}
```

The parameter is an object in which the key determines the type of report, and its value in the form of an object is the corresponding report settings. You can set the following keys:
* _flat_&mdash;for a report in the console;
* _html_&mdash;for html-report;
* _json_&mdash;for json-report.

All reports in the settings have an `enabled` parameter of the `Boolean` type, which determines whether the report is enabled or disabled. By default, only the report in the console is enabled.

Also, reports of the type `html` and `json` have an additional parameter `path`&mdash;the path to the file to which you want to save the report.

By default, the report is saved in the current working directory to a file `stat-reporter.html` or `stat-reporter.json` depending on the type of report.

### Passing parameters via the CLI

All plugin parameters that can be defined in the config can also be passed as command line options or through environment variables during Hermione startup. Use the prefix `--stat-reporter-` for command line options and `stat_reporter_` for environment variables. For example:

```bash
npx hermione --stat-reporter-reporters-html-enabled=true
```

```bash
stat_reporter_reporters_html_enabled = true npx hermione
```

## Commands

### merge-stat-reports

The plugin adds the `merge-stat-reports` command to Hermione, with which you can merge several reports into one report in both html and json format. At the same time, the command allows you to get the output of the final reports in two formats at once.

To save the final report in the required format, you need to specify the appropriate option: `--html` or `--json`.

```bash
npx hermione merge-stat-reports src-report-1.json src-report-2.json --html dest-html-report --json report.json
```

[stat-reporter]: https://github.com/gemini-testing/stat-reporter
[html-reporter]: https://github.com/gemini-testing/html-reporter
[hermione]: https://github.com/gemini-testing/hermione
