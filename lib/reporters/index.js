'use strict';

const _ = require('lodash');

const REPORTERS = {
    flat: require('./flat'),
    json: require('./json'),
    html: require('./html')
};

module.exports = (statistic, options) => {
    _(options.reporters)
        .pickBy((value) => value.enabled)
        .forEach((value, key) => REPORTERS[key](statistic, value));
};
