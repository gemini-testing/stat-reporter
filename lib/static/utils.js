'use strict';

const _ = require('lodash');
const {statuses} = require('../constants');

const getGroupedData = (data) => _.groupBy(data, 'browser');

exports.isNested = (data) => _.some(getGroupedData(data), browser => browser.length > 1);

exports.getNestedRows = (data, browser) => getGroupedData(data)[browser].map((row, index) => _.set(row, 'chunk', index + 1));

exports.getAggregatedRows = (data) => _
    .map(getGroupedData(data), (rows, browser) => ({
        browser,
        status: _.some(rows, {status: statuses.FAILED}) ? statuses.FAILED : statuses.PASSED,
        tests: _.sumBy(rows, 'tests'),
        passed: _.sumBy(rows, 'passed'),
        failed: _.sumBy(rows, 'failed'),
        skipped: _.sumBy(rows, 'skipped'),
        retries: _.sumBy(rows, 'retries'),
        minDuration: _.minBy(rows, 'duration').duration,
        maxDuration: _.maxBy(rows, 'duration').duration
    }));
