'use strict';

const chalk = require('chalk');
const Table = require('cli-table');
const _ = require('lodash');
const constants = require('../constants');
const utils = require('../utils');

module.exports = (statistic) => {
    const table = new Table({
        head: _.map(constants.flatColumns, 'Header'),
        style: {head: ['white']}
    });

    statistic.forEach((broStat) => {
        table.push([
            broStat.browserId,
            broStat.failed ? chalk.red('failed') : chalk.green('passed'),
            broStat.tests,
            chalk.green(broStat.passed),
            chalk.red(broStat.failed),
            chalk.cyan(broStat.skipped),
            chalk.cyan(broStat.retries),
            utils.humanizeDuration(broStat.duration)
        ]);
    });

    console.info(table.toString());
};
