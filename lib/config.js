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

const isRequestedType = (name, validationFn, type) => {
    return (v) => {
        if (!validationFn(v)) {
            throw new Error(`"${name}" option must be ${type}, but got ${typeof v}`);
        }
    };
};

const isBoolean = (name) => isRequestedType(name, _.isBoolean, 'boolean');

const isString = (name) => isRequestedType(name, _.isString, 'string');

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: isBoolean('enabled')
        }),
        reporters: section({
            flat: section({
                enabled: option({
                    defaultValue: true,
                    parseEnv: JSON.parse,
                    parseCli: JSON.parse,
                    validate: isBoolean('enabled')
                })
            }),
            html: section({
                enabled: option({
                    defaultValue: false,
                    parseEnv: JSON.parse,
                    parseCli: JSON.parse,
                    validate: isBoolean('enabled')
                }),
                path: option({
                    defaultValue: DEFAULT_REPORTER_HTML_PATH,
                    validate: isString('path')
                })
            }),
            json: section({
                enabled: option({
                    defaultValue: false,
                    parseEnv: JSON.parse,
                    parseCli: JSON.parse,
                    validate: isBoolean('enabled')
                }),
                path: option({
                    defaultValue: DEFAULT_REPORTER_JSON_PATH,
                    validate: isString('path')
                })
            })
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options) => {
    const env = process.env;
    const argv = process.argv;

    return getParser()({options, env, argv});
};
