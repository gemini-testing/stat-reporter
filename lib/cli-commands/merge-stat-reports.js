'use strict';

const {MERGE_STAT_REPORTS: commandName} = require('.');
const mergeStatReports = require('../merge-stat-reports');

module.exports = (program) => {
    program
        .command(`${commandName} [paths...]`)
        .allowUnknownOption()
        .description('merge reports')
        .option('-h, --html <path>', 'path to directory with merged html report')
        .option('-j, --json <path>', 'path to merged json report')
        .action((paths, options) => {
            try {
                mergeStatReports(paths, options);
            } catch (err) {
                console.error(err);
                process.exit(1);
            }
        });
};
