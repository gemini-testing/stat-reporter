'use strict';

const _ = require('lodash');
const AsyncEmitter = require('gemini-core').AsyncEmitter;

const lib = require('../lib/index');
const Stat = require('../lib/stat');
const geminiPlugin = require('../gemini');

function mkGemini_() {
    return _.extend(new AsyncEmitter(), {
        events: {
            START_BROWSER: 'startBrowser',
            STOP_BROWSER: 'stopBrowser',
            TEST_RESULT: 'testResult',
            RETRY: 'retry',
            SKIP_STATE: 'skipState',
            ERROR: 'err',
            END_RUNNER: 'endRunner'
        }
    });
}

describe('gemini', () => {
    const sandbox = sinon.sandbox.create();
    let gemini;

    beforeEach(() => {
        gemini = mkGemini_();
        geminiPlugin(gemini, {enabled: true});
    });

    afterEach(() => sandbox.restore());

    it('should do nothing for disabled plugin', () => {
        gemini = mkGemini_();
        const onSpy = sinon.spy(gemini.on);

        geminiPlugin(gemini, {enabled: false});

        assert.notCalled(onSpy);
    });

    it('should start browser time on "START_BROWSER" event', () => {
        sandbox.stub(Stat.prototype, 'markStartBrowserTime');
        gemini.emit(gemini.events.START_BROWSER, {id: 'some-browser'});

        assert.calledWith(Stat.prototype.markStartBrowserTime, 'some-browser');
    });

    it('should mark browser time on "STOP_BROWSER" event', () => {
        sandbox.stub(Stat.prototype, 'markEndBrowserTime');
        gemini.emit(gemini.events.STOP_BROWSER, {id: 'some-browser'});

        assert.calledWith(Stat.prototype.markEndBrowserTime, 'some-browser');
    });

    it('should add passed test on "TEST_RESULT" event with equal results', () => {
        sandbox.stub(Stat.prototype, 'addPassed');
        gemini.emit(gemini.events.TEST_RESULT, {browserId: 'some-browser', equal: true});

        assert.calledWith(Stat.prototype.addPassed, 'some-browser');
    });

    it('should add failed test on "TEST_RESULT" event on test fail', () => {
        sandbox.stub(Stat.prototype, 'addFailed');
        gemini.emit(gemini.events.TEST_RESULT, {browserId: 'some-browser', equal: false});

        assert.calledWith(Stat.prototype.addFailed, 'some-browser');
    });

    it('should add retried test on "RETRY" event', () => {
        sandbox.stub(Stat.prototype, 'addRetry');
        gemini.emit(gemini.events.RETRY, {browserId: 'some-browser'});

        assert.calledWith(Stat.prototype.addRetry, 'some-browser');
    });

    it('should add skipped test on "SKIP_STATE" event', () => {
        sandbox.stub(Stat.prototype, 'addSkipped');
        gemini.emit(gemini.events.SKIP_STATE, {browserId: 'some-browser'});

        assert.calledWith(Stat.prototype.addSkipped, 'some-browser');
    });

    it('should add failed test on "ERROR" event', () => {
        sandbox.stub(Stat.prototype, 'addFailed');
        gemini.emit(gemini.events.ERROR, {browserId: 'some-browser'});

        assert.calledWith(Stat.prototype.addFailed, 'some-browser');
    });

    it('should show collected statistic data on "RUNNER_END" event', () => {
        sandbox.stub(lib, 'showReport');
        sandbox.stub(Stat.prototype, 'getStatistic').returns('some-statistic');

        gemini.emit(gemini.events.END_RUNNER);

        assert.calledOnce(lib.showReport);
        assert.calledWith(lib.showReport, 'some-statistic', sinon.match.object);
    });
});
