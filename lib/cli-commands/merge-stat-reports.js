'use strict';

const {MERGE_STAT_REPORTS: commandName} = require('.');
const mergeStatReports = require('../merge-stat-reports');

module.exports = (program) => {
    program
        .command(`${commandName} [paths...]`)
        .allowUnknownOption()
        .description('merge reports')
        .option('-d, --destination <path>', 'path to directory with merged report', 'report')
        .option('--sort-by <column>', 'sort by column', 'browser')
        .action((paths, options) => {
            try {
                mergeStatReports(paths, options);
            } catch (err) {
                process.exit(1);
            }
        });
};
