'use strict';

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config.js');

exports.saveReportData = (data, reportDir) => {
    const reportFilePath = path.resolve(reportDir, 'report.json');

    fs.writeFileSync(reportFilePath, JSON.stringify(data), {encoding: 'utf-8'});
};

exports.compileReport = (reportDir) => {
    const modifiedConfig = Object.assign({}, webpackConfig, {
        output: {
            path: path.resolve(reportDir),
            filename: 'bundle.js'
        }
    });

    webpack(modifiedConfig, function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.saveIndexHtml = (reportDir) => {
    const indexFilePath = path.resolve(reportDir, 'index.html');
    const indexData =
        '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Browser statistic</title>' +
        '<script src="./bundle.js"></script>' +
        '</head>' +
        '<body><div id="root"></div></body>' +
        '</html>';

    fs.writeFileSync(indexFilePath, indexData, {encoding: 'utf-8'});
};
