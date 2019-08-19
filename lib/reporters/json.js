'use strict';

const _ = require('lodash');
const moment = require('moment');
const utils = require('../utils');

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const generateJson = (statistic) => {
    return statistic.map((broStat) => {
        const timeStart = moment(broStat.timeStart);
        const timeEnd = moment(broStat.timeEnd);

        return _(broStat)
            .pick(['tests', 'passed', 'failed', 'skipped', 'retries'])
            .set('browser', broStat.browserId)
            .set('start', timeStart.format(DATE_FORMAT))
            .set('end', timeEnd.format(DATE_FORMAT))
            .set('status', broStat.failed ? 'failed' : 'passed')
            .set('duration', timeEnd.diff(timeStart))
            .value();
    });
};

module.exports = (statistic, options) => utils.saveJsonReport(options.path, generateJson(statistic));

module.exports.generateJson = generateJson;
