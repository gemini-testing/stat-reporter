'use strict';

const _ = require('lodash');

const FIELDS = {
    TESTS: 'tests',
    PASSED: 'passed',
    SKIPPED: 'skipped',
    FAILED: 'failed',
    RETRIES: 'retries'
};

module.exports = class Model {
    constructor() {
        this._stat = new Map();
    }

    startBrowserTime(browserId) {
        const browserData = this._findOrCreate(browserId);

        if (!browserData.timeStart) {
            browserData.timeStart = new Date();
        }
    }

    markBrowserTime(browserId) {
        this._findOrCreate(browserId).timeEnd = new Date();
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
                : null;
        };

        this._stat.forEach((value, key) => {
            value.browserId = key;
            value.duration = calculateDuration(value);
            result.push(value);
        });

        return result;
    }

    _increaseCounter(browserId, counter) {
        this._findOrCreate(browserId)[counter]++;
    }

    _findOrCreate(browserId) {
        if (!this._stat.has(browserId)) {
            this._stat.set(browserId, _.values(FIELDS).reduce((acc, type) => _.set(acc, type, 0), {}));
        }

        return this._stat.get(browserId);
    }
};
