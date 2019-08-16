'use strict';

const lib = require('./lib');
const commands = require('./lib/cli-commands');
const _ = require('lodash');

module.exports = (hermione, options) => {
    options = lib.parseConfig(options);

    if (!options.enabled) {
        return;
    }

    const events = hermione.events;
    const stat = new lib.Stat();

    hermione.on(events.CLI, (commander) => {
        let command = commands.MERGE_STAT_REPORTS;
        require(`./lib/cli-commands/${command}`)(commander);
        commander.prependListener(`command:${command}`, () => this._run = _.noop);
    });

    hermione.on(events.SESSION_START, (wd, data) => stat.markStartBrowserTime(data.browserId));
    hermione.on(events.SESSION_END, (wd, data) => stat.markEndBrowserTime(data.browserId));

    hermione.on(events.TEST_FAIL, (data) => stat.addFailed(data.browserId));
    hermione.on(events.TEST_PASS, (data) => stat.addPassed(data.browserId));
    hermione.on(events.TEST_PENDING, (data) => stat.addSkipped(data.browserId));

    hermione.on(events.RETRY, (data) => stat.addRetry(data.browserId));

    hermione.on(events.RUNNER_END, () => lib.showReport(stat.getStatistic(), options));
};
