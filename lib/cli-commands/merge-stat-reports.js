'use strict';

const {MERGE_STAT_REPORTS: commandName} = require('.');
const statMergeReports = require('../merge-stat-reports');
const _ = require('lodash');

const formats = ['json', 'html'];

module.exports = (program) => {
    program
        .command(`${commandName} [paths...]`)
        .allowUnknownOption()
        .description('merge reports')
        .option('-o, --output <destination>', 'path to directory with merged report',
            collectOutput, [])
        .option('--sort-by <column>', 'sort by column', 'browser')
        .action((paths, options) => {
            try {
                statMergeReports(paths, options);
            } catch (err) {
                process.exit(1);
            }
        });
};

function collectOutput(value, previous) {
    const format = _(value).split('.').last();
    if (_.indexOf(formats, format) !== -1) {
        return previous.concat([value]);
    } else {
        return previous;
    }
}
