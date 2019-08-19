'use strict';

const utils = require('./utils');
const merge = require('./merge');
const fs = require('fs-extra');

module.exports = (paths, {destination, sortBy}) => {
    const content = merge(paths, sortBy);

    fs.ensureDir(destination);

    utils.saveReportData(content, destination);
};
