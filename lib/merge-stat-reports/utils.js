'use strict';

const path = require('path');
const fs = require('fs-extra');

exports.saveReportData = (data, reportDir) => {
    const reportFilePath = path.resolve(reportDir, 'report.json');

    fs.writeFileSync(reportFilePath, JSON.stringify(data), {encoding: 'utf-8'});
};
