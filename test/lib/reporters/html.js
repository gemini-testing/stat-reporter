'use strict';

const utils = require('../../../lib/utils');
const htmlReporter = require('../../../lib/reporters/html');
const jsonReporter = require('../../../lib/reporters/json');
const testUtils = require('../test-utils');

const getDefaultOpts = () => ({path: 'some-path'});

describe('lib/reporters/html', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(utils, 'saveHtmlReport');
        sandbox.stub(jsonReporter, 'generateJson');
    });

    afterEach(() => sandbox.restore());

    it('should generate json report', () => {
        const statistic = testUtils.generateStatData();
        htmlReporter(statistic, getDefaultOpts());

        assert.calledOnceWith(jsonReporter.generateJson, statistic);
    });

    describe('should save html report', () => {
        it('into the given directory', () => {
            htmlReporter(testUtils.generateStatData(), getDefaultOpts());

            assert.calledOnceWith(utils.saveHtmlReport, sinon.match(/some-path/), sinon.match.any);
        });

        it('with the generated json', () => {
            jsonReporter.generateJson.returns({
                some: 'data'
            });
            htmlReporter(testUtils.generateStatData(), getDefaultOpts());

            assert.calledOnceWith(utils.saveHtmlReport, sinon.match.any, {some: 'data'});
        });
    });
});
