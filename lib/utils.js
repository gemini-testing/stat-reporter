'use strict';

const path = require('path');
const moment = require('moment');
const fs = require('fs-extra');

exports.humanizeDuration = (duration) => moment(duration).format('mm:ss');

exports.saveJsonReport = (filePath, content) => {
    const fileFullPath = path.resolve(filePath);

    try {
        fs.ensureDirSync(path.dirname(fileFullPath));
        fs.writeJsonSync(fileFullPath, content, {encoding: 'utf-8'});
    } catch (err) {
        console.error(err);
    }
};

exports.saveHtmlReport = (destination, json) => {
    const sourcePath = path.resolve(__dirname, './static/dist');

    exports.saveJsonReport(path.join(destination, 'report.json'), json);

    fs.copySync(sourcePath, path.resolve(destination));
};

exports.requireCliModule = (command) => require(`./cli-commands/${command}`);
