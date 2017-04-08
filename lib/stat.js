'use strict';

const _ = require('lodash');

const FIELDS = {
    TESTS: 'tests',
    PASSED: 'passed',
    SKIPPED: 'skipped',
    FAILED: 'failed',
    RETRIES: 'retries',
    SESSIONS: 'sessions'
};

module.exports = class Stat {
    constructor() {
        this._stat = {};
    }

    markStartBrowserTime(browserId) {
        const browserData = this._getBrowserStat(browserId);

        this._increaseCounter(browserId, FIELDS.SESSIONS);

        if (!browserData.timeStart) {
            browserData.timeStart = new Date();
        }
    }

    markEndBrowserTime(browserId) {
        this._getBrowserStat(browserId).timeEnd = new Date();
    }

    addPassed(browserId) {
        this._increaseCounter(browserId, FIELDS.TESTS);
        this._increaseCounter(browserId, FIELDS.PASSED);
    }

    addSkipped(browserId) {
        this._increaseCounter(browserId, FIELDS.TESTS);
        this._increaseCounter(browserId, FIELDS.SKIPPED);
    }

    addFailed(browserId) {
        this._increaseCounter(browserId, FIELDS.TESTS);
        this._increaseCounter(browserId, FIELDS.FAILED);
    }

    addRetry(browserId) {
        this._increaseCounter(browserId, FIELDS.RETRIES);
    }

    getStatistic() {
        const result = [];

        const calculateDuration = (value) => {
            return (value.timeStart && value.timeEnd)
                ? value.timeEnd.getTime() - value.timeStart.getTime()
                : 0;
        };

        _.forEach(this._stat, (value, key) => {
            value.browserId = key;
            value.duration = calculateDuration(value);
            result.push(value);
        });

        return result;
    }

    _increaseCounter(browserId, counter) {
        this._getBrowserStat(browserId)[counter]++;
    }

    _getBrowserStat(browserId) {
        if (!this._stat[browserId]) {
            this._stat[browserId] = this._defaultStat();
        }

        return this._stat[browserId];
    }

    _defaultStat() {
        return {
            tests: 0,
            passed: 0,
            skipped: 0,
            failed: 0,
            retries: 0,
            sessions: 0
        };
    }
};
