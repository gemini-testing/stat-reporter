'use strict';

const QEmitter = require('qemitter');

const Model = require('../lib/model');
const BrowserStat = require('../lib/index');
const geminiPlug = require('../gemini');

function mkGemini_() {
    const gemini = new QEmitter();

    gemini.events = {};
    gemini.events.START_BROWSER = 'startBrowser';
    gemini.events.STOP_BROWSER = 'stopBrowser';
    gemini.events.TEST_RESULT = 'testResult';
    gemini.events.RETRY = 'retry';
    gemini.events.SKIP_STATE = 'skipState';
    gemini.events.WARNING = 'warning';
    gemini.events.ERROR = 'err';
    gemini.events.END_RUNNER = 'endRunner';

    return gemini;
}

describe('gemini', () => {
    const sandbox = sinon.sandbox.create();
    let gemini;

    beforeEach(() => {
        gemini = mkGemini_();
        geminiPlug(gemini, {enabled: true});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should start browser time on "START_BROWSER" event', () => {
        sandbox.stub(Model.prototype, 'startBrowserTime');
        gemini.emit(gemini.events.START_BROWSER, {id: 'some-browser'});

        assert.calledWith(Model.prototype.startBrowserTime, 'some-browser');
    });

    it('should mark browser time on "STOP_BROWSER" event', () => {
        sandbox.stub(Model.prototype, 'markBrowserTime');
        gemini.emit(gemini.events.STOP_BROWSER, {id: 'some-browser'});

        assert.calledWith(Model.prototype.markBrowserTime, 'some-browser');
    });

    it('should add passed test on "TEST_RESULT" event with equal results', () => {
        sandbox.stub(Model.prototype, 'addPassed');
        gemini.emit(gemini.events.TEST_RESULT, {browserId: 'some-browser', equal: true});

        assert.calledWith(Model.prototype.addPassed, 'some-browser');
    });

    it('should add failed test on "TEST_RESULT" event with non-equal results', () => {
        sandbox.stub(Model.prototype, 'addFailed');
        gemini.emit(gemini.events.TEST_RESULT, {browserId: 'some-browser', equal: false});

        assert.calledWith(Model.prototype.addFailed, 'some-browser');
    });

    it('should add retried test on "RETRY" event', () => {
        sandbox.stub(Model.prototype, 'addRetry');
        gemini.emit(gemini.events.RETRY, {browserId: 'some-browser'});

        assert.calledWith(Model.prototype.addRetry, 'some-browser');
    });

    it('should add skipped test on "SKIP_STATE" event', () => {
        sandbox.stub(Model.prototype, 'addSkipped');
        gemini.emit(gemini.events.SKIP_STATE, {browserId: 'some-browser'});

        assert.calledWith(Model.prototype.addSkipped, 'some-browser');
    });

    it('should add skipped test on "WARNING" event', () => {
        sandbox.stub(Model.prototype, 'addSkipped');
        gemini.emit(gemini.events.WARNING, {browserId: 'some-browser'});

        assert.calledWith(Model.prototype.addSkipped, 'some-browser');
    });

    it('should add failed test on "ERROR" event', () => {
        sandbox.stub(Model.prototype, 'addFailed');
        gemini.emit(gemini.events.ERROR, {browserId: 'some-browser'});

        assert.calledWith(Model.prototype.addFailed, 'some-browser');
    });

    it('should show collected statistic data on "RUNNER_END" event', () => {
        sandbox.stub(BrowserStat.prototype, 'showStatistic');
        gemini.emit(gemini.events.END_RUNNER);

        assert.called(BrowserStat.prototype.showStatistic);
    });
});
