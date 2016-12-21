'use strict';

const _ = require('lodash');
const Model = require('./model');
const parseConfig = require('./config');
const reporters = require('./reporters');

module.exports = class BrowserStat {
    constructor(tool, options) {
        this._tool = tool;
        this._options = options;

        this._model = new Model();
    }

    static create(tool, options) {
        options = parseConfig(options);

        if (options.enabled) {
            return new this(tool, options);
        }
    }

    subscribe(event, handler) {
        this._tool.on(event, handler.bind(this));
        return this;
    }

    get model() {
        return this._model;
    }

    showStatistic() {
        const data = this.model.getStatistic();

        _(this._options.reporters)
            .pickBy((value) => value.enabled)
            .forEach((value, key) => reporters[key](data, value));
    }
};
