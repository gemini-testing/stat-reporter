'use strict';

const util = require('../reporters/util');
const _ = require('lodash');

let result = null;

const mergeChunks = (paths) => {
    let result = [];
    _.forEach(paths, (path, chunkId) => {
        const chunkJson = util.loadFile(path);
        const chunk = JSON.parse(chunkJson);
        _.forEach(chunk, (broStat) => {
            _.set(broStat, 'chunk', chunkId + 1);
            broStat.duration = broStat.duration ? util.humanizeDuration(broStat.duration) : '';
        });
        result = _.concat(result, chunk);
    });
    return result;
};

const sortChunks = (array, identity) => _.sortBy(array, ['browser', identity]);

const addAggregateRows = (statistics) => {
    const agregates = _.reduce(statistics, (res, broStat) => {
        const key = broStat.browser;
        if (!res[key]) {
            res[key] = _.assign({}, broStat);
            res[key].duration = null;
            res[key].chunk = '-';
        } else {
            if (broStat.status === 'failed') {
                res[key].status = 'failed';
            }
            res[key].tests += broStat.tests;
            res[key].passed += broStat.passed;
            res[key].failed += broStat.failed;
            res[key].skipped += broStat.skipped;
            res[key].retries += broStat.retries;
        }

        return res;
    }, {});

    _.forOwn(agregates, (value, key) => {
        const index = _.findIndex(result, (o) => o.browser === key);
        statistics.splice(index, 0, value);
    });

    return statistics;
};

module.exports = (paths, sortBy) => {
    if (result) {
        return result;
    }

    result = mergeChunks(paths);
    result = sortChunks(result, sortBy);
    result = addAggregateRows(result);
    return result;
};
