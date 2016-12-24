'use strict';

const Model = require('../../lib/stat');

describe('lib/model', () => {
    const sandbox = sinon.sandbox.create();

    let model;
    let clock;

    function addStat_(statFunc) {
        const browserId = 'some-id';
        model.markStartBrowserTime(browserId);
        statFunc.call(model, browserId);
        model.markEndBrowserTime(browserId);
    }

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        model = new Model();
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('should be empty after initialization', () => {
        assert.deepEqual(model.getStatistic(), []);
    });

    describe('markStartBrowserTime', () => {
        it('should set browser start time', () => {
            const browserId = 'some-id';
            model.markStartBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set browser start time only once for given browser', () => {
            const browserId = 'some-id';

            model.markStartBrowserTime(browserId);
            clock.tick(300);
            model.markStartBrowserTime(browserId);

            model.markEndBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set own start time for each of browsers', () => {
            model.markStartBrowserTime('some-id');
            clock.tick(300);
            model.markStartBrowserTime('some-another-id');

            model.markEndBrowserTime('some-id');
            model.markEndBrowserTime('some-another-id');

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
            assert.deepEqual(model.getStatistic()[1].timeStart, new Date(300));
        });
    });

    describe('markEndBrowserTime', () => {
        it('should mark browser time end', () => {
            const browserId = 'some-id';

            model.markStartBrowserTime(browserId);
            clock.tick(100);
            model.markEndBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeEnd, new Date(100));
        });

        it('should rewrite browser time end for each call', () => {
            const browserId = 'some-id';
            model.markStartBrowserTime(browserId);

            clock.tick(100);
            model.markEndBrowserTime(browserId);

            clock.tick(100);
            model.markEndBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeEnd, new Date(200));
        });
    });

    describe('addPassed', () => {
        beforeEach(() => {
            addStat_(model.addPassed);
        });

        it('should increase common amount of tests', () => {
            assert.deepEqual(model.getStatistic()[0].tests, 1);
        });

        it('should increase amount of passed tests', () => {
            assert.deepEqual(model.getStatistic()[0].passed, 1);
        });
    });

    describe('addFailed', () => {
        beforeEach(() => {
            addStat_(model.addFailed);
        });

        it('should increase common amount of tests', () => {
            assert.deepEqual(model.getStatistic()[0].tests, 1);
        });

        it('should increase amount of failed tests', () => {
            assert.deepEqual(model.getStatistic()[0].failed, 1);
        });
    });

    describe('addSkipped', () => {
        beforeEach(() => {
            addStat_(model.addSkipped);
        });

        it('should increase common amount of tests', () => {
            assert.deepEqual(model.getStatistic()[0].tests, 1);
        });

        it('should increase amount of skipped tests', () => {
            assert.deepEqual(model.getStatistic()[0].skipped, 1);
        });
    });

    describe('addRetry', () => {
        beforeEach(() => {
            addStat_(model.addRetry);
        });

        it('should not increase common amount of tests', () => {
            assert.deepEqual(model.getStatistic()[0].tests, 0);
        });

        it('should increase amount of retried tests', () => {
            assert.deepEqual(model.getStatistic()[0].retries, 1);
        });
    });

    describe('getStatistic', () => {
        let browserId;

        beforeEach(() => {
            browserId = 'some-id';
            model.markStartBrowserTime(browserId);
            clock.tick(100);
            model.markEndBrowserTime(browserId);
        });

        it('should set browser identifier for stat item', () => {
            assert.deepEqual(model.getStatistic()[0].browserId, browserId);
        });

        it('should calculate duration', () => {
            assert.deepEqual(model.getStatistic()[0].duration, 100);
        });
    });
});
