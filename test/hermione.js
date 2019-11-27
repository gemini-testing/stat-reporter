'use strict';

const _ = require('lodash');
const QEmitter = require('qemitter');

const lib = require('../lib/index');
const Stat = require('../lib/stat');
const hermionePlugin = require('../hermione');
const cliCommands = require('../lib/cli-commands');
const utils = require('../lib/utils');

function mkHermione_() {
    return _.extend(new QEmitter(), {
        events: {
            CLI: 'cli',
            SESSION_START: 'startSession',
            SESSION_END: 'endSession',
            TEST_PASS: 'passTest',
            TEST_FAIL: 'failTest',
            RETRY: 'retry',
            TEST_PENDING: 'pendingTest',
            RUNNER_END: 'endRunner'
        }
    });
}

describe('hermione', () => {
    const sandbox = sinon.sandbox.create();

    let cliModuleStub;
    let hermione;

    beforeEach(() => {
        hermione = mkHermione_();
        hermionePlugin(hermione, {enabled: true});

        cliModuleStub = sandbox.stub();
        sandbox.stub(utils, 'requireCliModule').returns(cliModuleStub);
    });

    afterEach(() => sandbox.restore());

    it('should do nothing for disabled plugin', () => {
        hermione = mkHermione_();
        const onSpy = sinon.spy(hermione.on);

        hermionePlugin(hermione, {enabled: false});

        assert.notCalled(onSpy);
    });

    it('should load all cli commands', () => {
        hermione.emit(hermione.events.CLI);

        _.forEach(cliCommands, (name) => assert.calledOnceWith(utils.requireCliModule, name));
    });

    it('should require all cli commands on "CLI" event', () => {
        const commander = {some: 'values'};

        hermione.emit(hermione.events.CLI, commander);

        assert.alwaysCalledWith(cliModuleStub, commander);
    });

    it('should start browser time on "TEST_BEGIN" event', () => {
        sandbox.stub(Stat.prototype, 'markStartBrowserTime');
        hermione.emit(hermione.events.TEST_BEGIN, {browserId: 'some-browser'});

        assert.calledWith(Stat.prototype.markStartBrowserTime, 'some-browser');
    });

    it('should mark browser time on "TEST_END" event', () => {
        sandbox.stub(Stat.prototype, 'markEndBrowserTime');
        hermione.emit(hermione.events.TEST_END, {browserId: 'some-browser'});

        assert.calledWith(Stat.prototype.markEndBrowserTime, 'some-browser');
    });

    [
        {event: 'TEST_PASS', method: 'addPassed'},
        {event: 'TEST_FAIL', method: 'addFailed'},
        {event: 'TEST_PENDING', method: 'addSkipped'},
        {event: 'RETRY', method: 'addRetry'}
    ].forEach(({event, method}) => {
        it(`should add test on "${method}" event`, () => {
            sandbox.stub(Stat.prototype, method);
            const test = {foo: 'bar'};

            hermione.emit(hermione.events[event], test);

            assert.calledWith(Stat.prototype[method], test);
        });
    });

    it('should show collected statistic data on "RUNNER_END" event', () => {
        sandbox.stub(lib, 'showReport');
        sandbox.stub(Stat.prototype, 'getStatistic').returns('some-statistic');

        hermione.emit(hermione.events.RUNNER_END);

        assert.calledOnce(lib.showReport);
        assert.calledWith(lib.showReport, 'some-statistic', sinon.match.object);
    });
});
