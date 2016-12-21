'use strict';

const QEmitter = require('qemitter');
const reporters = require('../../lib/reporters');
const BrowserStat = require('../../lib/index');

describe('lib/index', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(reporters, 'flat', sinon.spy());
        sandbox.stub(reporters, 'html', sinon.spy());
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('should not initialize plugin', () => {
        it('if it options is not object', () => {
            const tool = sinon.stub();
            assert.isUndefined(BrowserStat.create(tool));
            assert.isUndefined(BrowserStat.create(tool, null));
            assert.isUndefined(BrowserStat.create(tool, ''));
        });

        it('if it is disabled in options', () => {
            assert.isUndefined(BrowserStat.create(sandbox.stub(), {enabled: false}));
        });
    });

    describe('subscribe', () => {
        it('should subscribe tool on given event with configured handler', () => {
            const handlerStub = sinon.spy();
            const tool = new QEmitter();

            const browserStat = BrowserStat.create(tool, {enabled: true});
            browserStat.subscribe('some-event', handlerStub);

            tool.emit('some-event');

            assert.calledOnce(handlerStub);
        });

        it('should use browserStat instance context in event handler', () => {
            const handlerStub = sinon.spy();
            const tool = new QEmitter();

            const browserStat = BrowserStat.create(tool, {enabled: true});
            browserStat.subscribe('some-event', handlerStub);

            tool.emit('some-event');

            assert.calledOn(handlerStub, browserStat);
        });

        it ('should return instance of plugin', () => {
            const browserStat = BrowserStat.create(new QEmitter(), {enabled: true});

            assert.instanceOf(browserStat.subscribe('some-event', () => {}), BrowserStat);
        });
    });

    describe('showStatistic', () => {
        it('should use all enabled reporters', () => {
            const browserStat = BrowserStat.create(sinon.stub(), {
                enabled: true,
                reporters: {
                    flat: {enabled: true},
                    html: {enabled: true}
                }
            });

            browserStat.showStatistic();

            assert.called(reporters.flat);
            assert.called(reporters.html);
        });

        it('should not use disabled reporters', () => {
            const browserStat = BrowserStat.create(sinon.stub(), {
                enabled: true,
                reporters: {
                    flat: {enabled: true},
                    html: {enabled: false}
                }
            });

            browserStat.showStatistic();

            assert.notCalled(reporters.html);
        });

        it('should pass collected statistic into reporters', () => {
            const browserStat = BrowserStat.create(sinon.stub(), {
                enabled: true,
                reporters: {
                    flat: {enabled: true}
                }
            });

            const statStub = sinon.stub();
            sandbox.stub(browserStat.model, 'getStatistic').returns(statStub);

            browserStat.showStatistic();

            assert.calledWith(reporters.flat, statStub);
        });

        it('should pass options into reporters', () => {
            const options = {
                enabled: true,
                reporters: {
                    flat: {enabled: true}
                }
            };
            const browserStat = BrowserStat.create(sinon.stub(), options);

            browserStat.showStatistic();

            assert.calledWith(reporters.flat, sinon.match.array, options.reporters.flat);
        });
    });
});
