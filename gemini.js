'use strict';

const lib = require('./lib');

module.exports = (gemini, options) => {
    options = lib.parseConfig(options);

    if (!options.enabled) {
        return;
    }

    const events = gemini.events;
    const stat = new lib.Stat();

    gemini.on(events.START_BROWSER, (data) => stat.markStartBrowserTime(data.id));
    gemini.on(events.STOP_BROWSER, (data) => stat.markEndBrowserTime(data.id));

    gemini.on(events.TEST_RESULT, (data) => {
        data.equal
            ? stat.addPassed(data.browserId)
            : stat.addFailed(data.browserId);
    });

    gemini.on(events.RETRY, (data) => stat.addRetry(data.browserId));
    gemini.on(events.SKIP_STATE, (data) => stat.addSkipped(data.browserId));
    gemini.on(events.ERROR, (data) => stat.addFailed(data.browserId));

    gemini.on(events.END_RUNNER, () => lib.showReport(stat.getStatistic(), options));
};
