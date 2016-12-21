'use strict';

const Model = require('../../lib/model');

describe('lib/model', () => {
    const sandbox = sinon.sandbox.create();

    let model;
    let clock;

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

    describe('startBrowserTime', () => {
        it('should set browser start time', () => {
            const browserId = 'some-id';
            model.startBrowserTime(browserId);
            model.markBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set browser start time only once for given browser', () => {
            const browserId = 'some-id';

            model.startBrowserTime(browserId);
            clock.tick(300);
            model.startBrowserTime(browserId);

            model.markBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
        });

        it('should set own start time for each of browsers', () => {
            model.startBrowserTime('some-id');
            clock.tick(300);
            model.startBrowserTime('some-another-id');

            model.markBrowserTime('some-id');
            model.markBrowserTime('some-another-id');

            assert.deepEqual(model.getStatistic()[0].timeStart, new Date(0));
            assert.deepEqual(model.getStatistic()[1].timeStart, new Date(300));
        });
    });

    describe('markBrowserTime', () => {
        it('should mark browser time end', () => {
            const browserId = 'some-id';

            model.startBrowserTime(browserId);
            clock.tick(100);
            model.markBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeEnd, new Date(100));
        });

        it('should rewrite browser time end for each call', () => {
            const browserId = 'some-id';
            model.startBrowserTime(browserId);

            clock.tick(100);
            model.markBrowserTime(browserId);

            clock.tick(100);
            model.markBrowserTime(browserId);

            assert.deepEqual(model.getStatistic()[0].timeEnd, new Date(200));
        });
    });

    describe('addPassed', () => {
        beforeEach(() => {
            const browserId = 'some-id';
            model.startBrowserTime(browserId);
            model.addPassed(browserId);
            model.markBrowserTime(browserId);
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
            const browserId = 'some-id';
            model.startBrowserTime(browserId);
            model.addFailed(browserId);
            model.markBrowserTime(browserId);
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
            const browserId = 'some-id';
            model.startBrowserTime(browserId);
            model.addSkipped(browserId);
            model.markBrowserTime(browserId);
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
            const browserId = 'some-id';
            model.startBrowserTime(browserId);
            model.addRetry(browserId);
            model.markBrowserTime(browserId);
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
            model.startBrowserTime(browserId);
            clock.tick(100);
            model.markBrowserTime(browserId);
        });

        it('should set browser identifier for stat item', () => {
            assert.deepEqual(model.getStatistic()[0].browserId, browserId);
        });

        it('should calculate duration', () => {
            assert.deepEqual(model.getStatistic()[0].duration, 100);
        });
    });
});
