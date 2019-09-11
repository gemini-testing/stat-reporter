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

    hermione.on(events.TEST_BEGIN, (data) => stat.markStartBrowserTime(data.browserId));
    hermione.on(events.TEST_END, (data) => stat.markEndBrowserTime(data.browserId));

    hermione.on(events.TEST_FAIL, (data) => stat.addFailed(data.browserId));
    hermione.on(events.TEST_PASS, (data) => stat.addPassed(data.browserId));
    hermione.on(events.TEST_PENDING, (data) => stat.addSkipped(data.browserId));

    hermione.on(events.RETRY, (data) => stat.addRetry(data.browserId));

    hermione.on(events.RUNNER_END, () => lib.showReport(stat.getStatistic(), options));
};
