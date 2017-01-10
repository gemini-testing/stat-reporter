'use strict';

const chalk = require('chalk');
const Table = require('cli-table');
const util = require('./util');

module.exports = (statistic) => {
    const table = new Table({
        head: util.columns,
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
            util.humanizeDuration(broStat.duration)
        ]);
    });

    console.info(table.toString());
};
