'use strict';

const _ = require('lodash');
const utils = require('../../../lib/static/utils');
const testUtils = require('../test-utils');

describe('lib/static/utils', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    describe('isNested', () => {
        it('should return false if all browsers are not repeated in the list', () => {
            const data = _.concat(
                testUtils.generateStatData({browser: 'first-browser'}),
                testUtils.generateStatData({browser: 'second-browser'})
            );

            assert.isFalse(utils.isNested(data));
        });

        it('should return true if some browser repeats in the list', () => {
            const data = _.concat(
                testUtils.generateStatData({browser: 'first-browser'}),
                testUtils.generateStatData({browser: 'first-browser'}),
                testUtils.generateStatData({browser: 'second-browser'})
            );

            assert.isTrue(utils.isNested(data));
        });
    });

    describe('getNestedRows', () => {
        it('should add the chunk property', () => {
            const data = _.concat(
                testUtils.generateStatData({browser: 'first-browser'}),
                testUtils.generateStatData({browser: 'second-browser'}),
                testUtils.generateStatData({browser: 'second-browser'})
            );
            let rows = utils.getNestedRows(data, 'first-browser');
            assert.equal(rows[0].chunk, 1);

            rows = utils.getNestedRows(data, 'second-browser');
            assert.equal(rows[0].chunk, 1);
            assert.equal(rows[1].chunk, 2);
        });
    });

    describe('getAggregatedRows', () => {
        it('should have valid values', () => {
            const commonFirefoxProps = {
                tests: 1,
                passed: 1,
                failed: 1,
                skipped: 1,
                retries: 1
            };
            const commonChromeProps = {
                tests: 2,
                passed: 2,
                failed: 2,
                skipped: 2,
                retries: 2
            };
            const data = _.concat(
                testUtils.generateStatData(_.defaults({browser: 'firefox', status: 'passed', duration: Infinity}, commonFirefoxProps)),
                testUtils.generateStatData(_.defaults({browser: 'firefox', status: 'passed', duration: 0}, commonFirefoxProps)),
                testUtils.generateStatData(_.defaults({browser: 'chrome', status: 'failed'}, commonChromeProps)),
                testUtils.generateStatData(_.defaults({browser: 'chrome', status: 'passed'}, commonChromeProps))
            );
            const rows = utils.getAggregatedRows(data);

            assert.strictEqual(rows[0].browser, 'firefox');
            assert.strictEqual(rows[1].browser, 'chrome');

            assert.strictEqual(rows[0].status, 'passed');
            assert.strictEqual(rows[1].status, 'failed');

            _.forEach(['tests', 'passed', 'failed', 'skipped', 'retries'], property => {
                assert.strictEqual(rows[0][property], 2);
                assert.strictEqual(rows[1][property], 4);
            });

            assert.strictEqual(rows[0].minDuration, 0);
            assert.strictEqual(rows[0].maxDuration, Infinity);
        });
    });
});
