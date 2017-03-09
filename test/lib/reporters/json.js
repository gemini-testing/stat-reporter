'use strict';

const _ = require('lodash');
const util = require('../../../lib/reporters/util');
const jsonReporter = require('../../../lib/reporters/json');

const testUtils = require('./test-utils');

describe('lib/reporters/json', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => sandbox.stub(util, 'saveFile'));

    afterEach(() => sandbox.restore());

    it('should save model into file with given path', () => {
        jsonReporter(testUtils.generateStatData(), {path: 'some-file.json'});

        assert.calledWith(util.saveFile, 'some-file.json');
    });

    describe('should have valid value for', () => {
        function reportJSON_(options) {
            jsonReporter(testUtils.generateStatData(options), {});
            return JSON.parse(util.saveFile.firstCall.args[1])[0];
        }

        it('browser', () => {
            assert.propertyVal(reportJSON_({browserId: 'some-browser'}), 'browser', 'some-browser');
        });

        ['start', 'end'].forEach((item) => {
            it(item, () => {
                const data = _.set({}, 'time' + _.capitalize(item), new Date(2017, 2, 12, 10, 30, 2));

                assert.propertyVal(reportJSON_(data), item, '2017-03-12 10:30:02');
            });

            it(`${item} (special date)`, () => {
                const data = _.set({}, 'time' + _.capitalize(item), new Date(2017, 0, 1));

                assert.propertyVal(reportJSON_(data), item, '2017-01-01 00:00:00');
            });
        });

        ['passed', 'failed'].forEach((status, failedAmount) => {
            it(`status (${status})`, () => {
                assert.propertyVal(reportJSON_({'failed': failedAmount}), 'status', status);
            });
        });

        [
            'tests',
            'passed',
            'failed',
            'skipped',
            'retries'
        ].forEach((field) => {
            it(`${field} (should be passed as is)`, () => {
                assert.propertyVal(reportJSON_(_.set({}, field, 100500)), field, 100500);
            });
        });
    });
});
