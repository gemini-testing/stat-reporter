'user strict';

const util = require('../reporters/util');

const merge = require('./merge');

module.exports = (paths, options, output) => {
    const content = merge(paths, options);
    util.saveFile(output, JSON.stringify(content));
};
