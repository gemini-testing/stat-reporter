'use strict';

const _ = require('lodash');

exports.generateStatData = (opts) => {
    return [_.defaults(opts || {}, {
        browserId: 'some-browser',
        tests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        retries: 0,
        duration: 0
    })];
};
