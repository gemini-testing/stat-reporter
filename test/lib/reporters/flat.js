'use strict';

const chalk = require('chalk');
const flatReporter = require('../../../lib/reporters/flat');

const testUtils = require('./test-utils');

describe('lib/reporters/flat', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(console, 'info');
    });

    afterEach(() => sandbox.restore());

    it('should work with empty statistic data', () => {
        flatReporter([]);

        assert.calledOnce(console.info);
        assert.calledWithMatch(console.info, sinon.match.string);
    });

    describe('should draw', () => {
        it('"passed" tests status if browser statistic has not failed tests', () => {
            flatReporter(testUtils.generateStatData({failed: 0}));

            assert.include(console.info.firstCall.args[0], `${chalk.green('passed')}`);
        });

        it('"failed" tests status if browser statistic has failed tests', () => {
            flatReporter(testUtils.generateStatData({failed: 101}));

            assert.include(console.info.firstCall.args[0], `${chalk.red('failed')}`);
        });

        it('should draw humanized tests duration', () => {
            flatReporter(testUtils.generateStatData({duration: 61000}));

            assert.include(console.info.firstCall.args[0], `01:01`);
        });
    });
});

