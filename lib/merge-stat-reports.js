'use strict';

const utils = require('./utils');
const fs = require('fs-extra');
const _ = require('lodash');

module.exports = (paths, options) => {
    const reportCollection = _(paths).map((path) => fs.readJsonSync(path)).flatten().value();

    options.html && utils.saveHtmlReport(options.html, reportCollection);
    options.json && utils.saveJsonReport(options.json, reportCollection);
};
