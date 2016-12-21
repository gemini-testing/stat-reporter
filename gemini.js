'use strict';

const BrowserStat = require('./lib/index');

module.exports = (gemini, options) => {
    const events = gemini.events;

    BrowserStat
        .create(gemini, options)
        .subscribe(events.START_BROWSER, function(data) {
            this.model.startBrowserTime(data.id);
        })
        .subscribe(events.STOP_BROWSER, function(data) {
            this.model.markBrowserTime(data.id);
        })
        .subscribe(events.TEST_RESULT, function(data) {
            data.equal
                ? this.model.addPassed(data.browserId)
                : this.model.addFailed(data.browserId);
        })
        .subscribe(events.RETRY, function(data) {
            this.model.addRetry(data.browserId);
        })
        .subscribe(events.SKIP_STATE, function(data) {
            this.model.addSkipped(data.browserId);
        })
        .subscribe(events.WARNING, function(data) {
            this.model.addSkipped(data.browserId);
        })
        .subscribe(events.ERROR, function(data) {
            this.model.addFailed(data.browserId);
        })
        .subscribe(events.END_RUNNER, function() {
            this.showStatistic();
        });
};
