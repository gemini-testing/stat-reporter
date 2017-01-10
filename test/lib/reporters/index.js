'use strict';

const proxyquire = require('proxyquire');

describe('showStatistic', () => {
    const sandbox = sinon.sandbox.create();

    let showReport;
    let flatSpy;
    let htmlSpy;

    beforeEach(() => {
        flatSpy = sandbox.spy();
        htmlSpy = sandbox.spy();

        showReport = proxyquire('../../../lib/reporters/index', {
            './flat': flatSpy,
            './html': htmlSpy
        });
    });

    afterEach(() => sandbox.restore());

    it('should use all enabled reporters', () => {
        showReport(sandbox.stub(), {
            reporters: {
                flat: {enabled: true},
                html: {enabled: true}
            }
        });

        assert.called(flatSpy);
        assert.called(htmlSpy);
    });

    it('should not use disabled reporters', () => {
        showReport(sandbox.stub(), {
            enabled: true,
            reporters: {
                flat: {enabled: true},
                html: {enabled: false}
            }
        });

        assert.notCalled(htmlSpy);
    });

    it('should pass collected statistic into reporters', () => {
        const statistic = sandbox.stub();

        showReport(statistic, {
            enabled: true,
            reporters: {
                flat: {enabled: true}
            }
        });

        assert.calledWith(flatSpy, statistic);
    });

    it('should use own reporter options', () => {
        const options = {
            enabled: true,
            reporters: {
                flat: {enabled: true}
            }
        };

        showReport(sandbox.stub(), options);

        assert.calledWith(flatSpy, sinon.match.any, options.reporters.flat);
    });
});
