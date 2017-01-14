'use strict';

const path = require('path');
const moment = require('moment');
const fs = require('fs-extra');

exports.columns = [
    'browser',
    'status',
    'tests',
    'passed',
    'failed',
    'skipped',
    'retries',
    'duration'
];

exports.humanizeDuration = (duration) => duration ? moment(duration).format('mm:ss') : 'n/a';

exports.saveFile = (filePath, content) => {
    const fileFullPath = path.resolve(filePath);

    try {
        fs.ensureDirSync(path.dirname(fileFullPath));
        fs.writeFileSync(fileFullPath, content, {encoding: 'utf-8'});
    } catch (err) {
        console.error(err);
    }
};
