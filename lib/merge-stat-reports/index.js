'use strict';

const _ = require('lodash');

const REPORTERS = {
    html: require('./html'),
    json: require('./json')
};

module.exports = (paths, options) => {
    _(options.output)
        .forEach(out => {
            const format = _(out).split('.').last();
            REPORTERS[format](paths, options, out);
        });
};
