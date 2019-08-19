'use strict';

const path = require('path');
const moment = require('moment');
const fs = require('fs-extra');

exports.columns = [
    'browserId',
    'status',
    'tests',
    'passed',
    'failed',
    'skipped',
    'retries',
    'duration'
];

exports.humanizeDuration = (duration) => moment(duration).format('mm:ss');

exports.saveFile = (filePath, content) => {
    const fileFullPath = path.resolve(filePath);

    try {
        fs.ensureDirSync(path.dirname(fileFullPath));
        fs.writeFileSync(fileFullPath, content, {encoding: 'utf-8'});
    } catch (err) {
        console.error(err);
    }
};

exports.loadFile = (filePath) => {
    const fileFullPath = path.resolve(filePath);
    try {
        fs.ensureDirSync(path.dirname(fileFullPath));
        const json = fs.readFileSync(fileFullPath, {encoding: 'utf-8'});
        return json;
    } catch (err) {
        console.error(err);
    }
};
