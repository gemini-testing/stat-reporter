'use strict';

const utils = require('../utils');
const json = require('./json');

module.exports = (statistic, options) => utils.saveHtmlReport(options.path, json.generateJson(statistic));
