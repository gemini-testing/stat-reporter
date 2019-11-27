'use strict';

const _ = require('lodash');

const FIELDS = {
    TESTS: 'tests',
    PASSED: 'passed',
    SKIPPED: 'skipped',
    FAILED: 'failed',
    RETRIES: 'retries'
};

module.exports = class Stat {
    constructor() {
        this._statsByBro = {};
        this._testsByBro = {};
    }

    markStartBrowserTime(browserId) {
        const browserData = this._getBrowserStat(browserId);

        if (!browserData.timeStart) {
            browserData.timeStart = new Date();
        }
    }

    markEndBrowserTime(browserId) {
        this._getBrowserStat(browserId).timeEnd = new Date();
    }

    addPassed(test) {
        this._addStat(test, FIELDS.PASSED);
    }

    addSkipped(test) {
        this._addStat(test, FIELDS.SKIPPED);
    }

    addFailed(test) {
        this._addStat(test, FIELDS.FAILED);
    }

    addRetry(test) {
        this._increaseStatCounter(test.browserId, FIELDS.RETRIES);
    }

    getStatistic() {
        const result = [];

        const calculateDuration = (value) => {
            return (value.timeStart && value.timeEnd)
                ? value.timeEnd.getTime() - value.timeStart.getTime()
                : 0;
        };

        _.forEach(this._statsByBro, (value, key) => {
            value.browserId = key;
            value.duration = calculateDuration(value);
            value.tests = _.get(this._testsByBro[key], 'size', 0);
            result.push(value);
        });

        return result;
    }

    _addStat(test, status) {
        this._increaseStatCounter(test.browserId, status);
        this._increaseTestCounter(test);
    }

    _increaseStatCounter(browserId, status) {
        this._getBrowserStat(browserId)[status]++;
    }

    _increaseTestCounter(test) {
        const testId = getTestId(test);

        this._getBrowserTests(test.browserId).add(testId);
    }

    _getBrowserStat(browserId) {
        if (!this._statsByBro[browserId]) {
            this._statsByBro[browserId] = this._defaultStat();
        }

        return this._statsByBro[browserId];
    }

    _getBrowserTests(browserId) {
        if (!this._testsByBro[browserId]) {
            this._testsByBro[browserId] = new Set();
        }

        return this._testsByBro[browserId];
    }

    _defaultStat() {
        return {
            passed: 0,
            skipped: 0,
            failed: 0,
            retries: 0
        };
    }
};

function getTestId(test) {
    return `${test.id}/${test.browserId}`;
}
