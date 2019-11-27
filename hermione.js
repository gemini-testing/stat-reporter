'use strict';

const lib = require('./lib');
const cliCommands = require('./lib/cli-commands');
const utils = require('./lib/utils');

const _ = require('lodash');

module.exports = (hermione, options) => {
    options = lib.parseConfig(options);

    if (!options.enabled) {
        return;
    }

    const events = hermione.events;
    const stat = new lib.Stat();

    hermione.on(events.CLI, (commander) => {
        _.values(cliCommands).forEach(command => {
            utils.requireCliModule(command)(commander);
        });
    });

    hermione.on(events.TEST_BEGIN, (test) => stat.markStartBrowserTime(test.browserId));
    hermione.on(events.TEST_END, (test) => stat.markEndBrowserTime(test.browserId));

    hermione.on(events.TEST_FAIL, (test) => stat.addFailed(test));
    hermione.on(events.TEST_PASS, (test) => stat.addPassed(test));
    hermione.on(events.TEST_PENDING, (test) => stat.addSkipped(test));
    hermione.on(events.RETRY, (test) => stat.addRetry(test));

    hermione.on(events.RUNNER_END, () => lib.showReport(stat.getStatistic(), options));
};
