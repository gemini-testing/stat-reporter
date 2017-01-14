'use strict';

const htmlTable = require('html-tablify');
const util = require('./util');

module.exports = (statistic, options) => {
    const table = htmlTable.tablify({
        data: statistic.map((broStat) => {
            broStat.status = broStat.failed ? 'failed' : 'passed';
            broStat.duration = util.humanizeDuration(broStat.duration);
            return broStat;
        }),
        header: util.columns,
        cellpadding: 5
    });

    util.saveFile(options.path, wrapHtml(table));
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
