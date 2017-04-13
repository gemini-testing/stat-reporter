'use strict';

const lib = require('./lib');
const Stat = lib.Stat;

module.exports = (hermione, options) => {
    options = lib.parseConfig(options);

    if (!options.enabled) {
        return;
    }

    const events = hermione.events;
    const stat = new Stat();

    hermione.on(events.SESSION_START, (wd, data) => stat.markStartBrowserTime(data.browserId));
    hermione.on(events.SESSION_END, (wd, data) => stat.markEndBrowserTime(data.browserId));

    hermione.on(events.TEST_FAIL, (data) => stat.addFailed(data.browserId));
    hermione.on(events.TEST_PASS, (data) => stat.addPassed(data.browserId));
    hermione.on(events.TEST_PENDING, (data) => stat.addSkipped(data.browserId));

    hermione.on(events.RETRY, (data) => stat.addRetry(data.browserId));

    hermione.on(events.RUNNER_END, () => lib.showReport(stat.getStatistic(), options));
};
