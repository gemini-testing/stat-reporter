'use strict';

const util = require('../../../lib/reporters/util');
const htmlReporter = require('../../../lib/reporters/html');

const testUtils = require('./test-utils');

const getDefaultOpts = () => ({path: 'stat-reporter.html'});

describe('lib/reporters/html', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(util, 'saveFile');
    });

    afterEach(() => sandbox.restore());

    it('should work with empty statistic data', () => {
        htmlReporter([], getDefaultOpts());

        assert.calledOnce(util.saveFile);
        assert.calledWith(util.saveFile, sinon.match.string, sinon.match.string);
    });

    describe('should save html into file', () => {
        it('with default file path', () => {
            htmlReporter(
                testUtils.generateStatData({}),
                getDefaultOpts()
            );

            assert.calledWith(util.saveFile, 'stat-reporter.html');
        });

        it('with given file path', () => {
            htmlReporter(testUtils.generateStatData(), {path: 'some-file.html'});

            assert.calledWith(util.saveFile, 'some-file.html');
        });
    });

    it('should use html page wrapper', () => {
        htmlReporter(
            testUtils.generateStatData(),
            getDefaultOpts()
        );

        const html = util.saveFile.firstCall.args[1];

        assert.include(html, '<!DOCTYPE html>');
        assert.include(html, '<body>');
        assert.include(html, '</body>');
        assert.include(html, '</html>');
    });

    describe('should draw', () => {
        it('"failed" tests status if browser statistic has failed tests', () => {
            htmlReporter(
                testUtils.generateStatData({failed: 101}),
                getDefaultOpts()
            );

            const html = util.saveFile.firstCall.args[1];

            assert.include(html, '<td>failed</td>');
        });

        it('"passed" tests status if browser statistic has no failed tests', () => {
            htmlReporter(
                testUtils.generateStatData(),
                getDefaultOpts()
            );

            const html = util.saveFile.firstCall.args[1];

            assert.include(html, '<td>passed</td>');
        });
    });
});
