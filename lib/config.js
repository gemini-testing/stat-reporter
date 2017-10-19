'use strict';

const _ = require('lodash');
const configParser = require('gemini-configparser');

const root = configParser.root;
const section = configParser.section;
const option = configParser.option;

const ENV_PREFIX = 'stat_reporter_';
const CLI_PREFIX = '--stat-reporter-';
const DEFAULT_REPORTER_HTML_PATH = 'stat-reporter.html';
const DEFAULT_REPORTER_JSON_PATH = 'stat-reporter.json';

module.exports = (options) => {
    const env = process.env;
    const argv = process.argv;

    return getParser()({options, env, argv});
};

function getParser() {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            validate: _.isBoolean
        }),
        reporters: section({
            flat: section({
                enabled: option({
                    defaultValue: true,
                    parseEnv: JSON.parse,
                    validate: _.isBoolean
                })
            }),
            html: section({
                enabled: option({
                    defaultValue: false,
                    parseEnv: JSON.parse,
                    validate: _.isBoolean
                }),
                path: option({
                    defaultValue: DEFAULT_REPORTER_HTML_PATH,
                    validate: _.isString
                })
            }),
            json: section({
                enabled: option({
                    defaultValue: false,
                    parseEnv: JSON.parse,
                    validate: _.isBoolean
                }),
                path: option({
                    defaultValue: DEFAULT_REPORTER_JSON_PATH,
                    validate: _.isString
                })
            })
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
}
