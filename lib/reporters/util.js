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
    'sessions',
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
