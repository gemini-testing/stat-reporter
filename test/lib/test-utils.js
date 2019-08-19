'use strict';

const _ = require('lodash');

exports.generateStatData = (opts, count = 1) => {
    return _.map(Array(count), () => _.defaults({}, opts, {
        browser: 'some-browser',
        browserId: 'some-browser',
        tests: 1,
        passed: 1,
        failed: 1,
        skipped: 1,
        retries: 1,
        duration: 0
    }));
};
