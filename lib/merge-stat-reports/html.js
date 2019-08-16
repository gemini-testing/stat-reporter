'use strict';

const htmlTable = require('html-tablify');
const util = require('../reporters/util');
const _ = require('lodash');
const merge = require('./merge');

const columns = [
    'browser',
    'chunk',
    'status',
    'tests',
    'passed',
    'failed',
    'skipped',
    'retries',
    'duration'
];

module.exports = (paths, options, output) => {
    let content = merge(paths, options);

    const table = htmlTable.tablify({
        data: _(content).forEach((broStat) => {
            broStat.duration = broStat.duration ? util.humanizeDuration(broStat.duration) : '';
        }),
        header: columns,
        cellpadding: 10
    });

    util.saveFile(output, wrapHtml(table));
};

function wrapHtml(body) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Browser statistic</title>
        </head>
        <body>
            ${body}  
        </body>
        </html>
    `;
}
