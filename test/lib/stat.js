'use strict';

const _ = require('lodash');
const Stat = require('../../lib/stat');

describe('lib/stat', () => {
    const sandbox = sinon.sandbox.create();

    let stat;
    let clock;

    function addStat_(statFunc, test = {}) {
        test = _.defaults(test, {id: '1', browserId: 'default-bro'});

        stat.markStartBrowserTime(test.browserId);
        statFunc.call(stat, test);
        stat.markEndBrowserTime(test.browserId);
    }

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        stat = new Stat();
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('should be empty after initialization', () => {
        assert.deepEqual(stat.getStatistic(), []);
    });

    describe('markStartBrowserTime', () => {
        it('should set browser start time', () => {
            const browserId = 'some-id';
            stat.markStartBrowserTime(browserId);

            assert.deepEqual(stat.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set browser start time only once for given browser', () => {
            const browserId = 'some-id';

            stat.markStartBrowserTime(browserId);
            clock.tick(300);
            stat.markStartBrowserTime(browserId);

            stat.markEndBrowserTime(browserId);

            assert.deepEqual(stat.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set own start time for each of browsers', () => {
            stat.markStartBrowserTime('some-id');
            clock.tick(300);
            stat.markStartBrowserTime('some-another-id');

            stat.markEndBrowserTime('some-id');
            stat.markEndBrowserTime('some-another-id');

            assert.deepEqual(stat.getStatistic()[0].timeStart, new Date(0));
            assert.deepEqual(stat.getStatistic()[1].timeStart, new Date(300));
        });
    });

    describe('markEndBrowserTime', () => {
        it('should mark browser time end', () => {
            const browserId = 'some-id';

            stat.markStartBrowserTime(browserId);
            clock.tick(100);
            stat.markEndBrowserTime(browserId);

            assert.deepEqual(stat.getStatistic()[0].timeEnd, new Date(100));
        });

        it('should rewrite browser time end for each call', () => {
            const browserId = 'some-id';
            stat.markStartBrowserTime(browserId);

            clock.tick(100);
            stat.markEndBrowserTime(browserId);

            clock.tick(100);
            stat.markEndBrowserTime(browserId);

            assert.deepEqual(stat.getStatistic()[0].timeEnd, new Date(200));
        });
    });

    [
        {name: 'passed', method: 'addPassed'},
        {name: 'failed', method: 'addFailed'},
        {name: 'skipped', method: 'addSkipped'}
    ].forEach(({name, method}) => {
        describe(`${method}`, () => {
            beforeEach(() => addStat_(stat[method]));

            it('should increase common amount of tests', () => {
                assert.equal(stat.getStatistic()[0].tests, 1);
            });

            it('should increase amount of passed tests', () => {
                assert.equal(stat.getStatistic()[0][name], 1);
            });
        });
    });

    describe('addRetry', () => {
        beforeEach(() => addStat_(stat.addRetry));

        it('should not increase common amount of tests', () => {
            assert.equal(stat.getStatistic()[0].tests, 0);
        });

        it('should increase amount of retried tests', () => {
            assert.equal(stat.getStatistic()[0].retries, 1);
        });
    });

    describe('common amount of tests', () => {
        it('should not increase for the same test', () => {
            const test = {id: '1', browserId: 'yabro'};

            addStat_(stat.addPassed, test);
            addStat_(stat.addFailed, test);

            assert.equal(stat.getStatistic()[0].tests, 1);
        });

        it('should increase for different tests', () => {
            const test1 = {id: '1', browserId: 'yabro'};
            const test2 = {id: '2', browserId: 'yabro'};

            addStat_(stat.addPassed, test1);
            addStat_(stat.addFailed, test2);

            assert.equal(stat.getStatistic()[0].tests, 2);
        });

        it('should count for each of browsers', () => {
            const test1 = {id: '1', browserId: 'yabro-1'};
            const test2 = {id: '1', browserId: 'yabro-2'};

            addStat_(stat.addPassed, test1);
            addStat_(stat.addFailed, test2);

            assert.equal(stat.getStatistic()[0].tests, 1);
            assert.equal(stat.getStatistic()[1].tests, 1);
        });
    });

    describe('getStatistic', () => {
        let browserId;

        beforeEach(() => {
            browserId = 'some-id';
            stat.markStartBrowserTime(browserId);
            clock.tick(100);
            stat.markEndBrowserTime(browserId);
        });

        it('should set browser identifier for stat item', () => {
            assert.equal(stat.getStatistic()[0].browserId, browserId);
        });

        it('should calculate duration', () => {
            assert.equal(stat.getStatistic()[0].duration, 100);
        });
    });
});
