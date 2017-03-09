'use strict';

const _ = require('lodash');
const moment = require('moment');
const util = require('./util');

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

module.exports = (statistic, options) => {
    const content = statistic.map((broStat) => {
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

    util.saveFile(options.path, JSON.stringify(content));
};
