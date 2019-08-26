'use strict';

const mergeStatReports = require('../../lib/merge-stat-reports');
const utils = require('../../lib/utils');
const fs = require('fs-extra');

describe('lib/merge-stat-reports', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(utils, 'saveHtmlReport');
        sandbox.stub(utils, 'saveJsonReport');
        sandbox.stub(fs, 'readJsonSync');
    });
    afterEach(() => sandbox.restore());

    it('should read all provided reports', () => {
        const paths = [
            'first-path',
            'second-path'
        ];
        mergeStatReports(paths, {});

        assert.calledTwice(fs.readJsonSync);
        assert.calledWith(fs.readJsonSync, 'first-path');
        assert.calledWith(fs.readJsonSync, 'second-path');
    });

    it('should save html report if html path is provided', () => {
        fs.readJsonSync.withArgs('foo').returns([{baz: 'quux'}]);
        fs.readJsonSync.withArgs('bar').returns([{asd: 'zxc'}]);
        mergeStatReports(['foo', 'bar'], {html: 'html-path'});

        assert.calledOnceWith(utils.saveHtmlReport, 'html-path', [{baz: 'quux'}, {asd: 'zxc'}]);
    });

    it('should not save html report if html path is empty', () => {
        mergeStatReports([], {html: null});

        assert.notCalled(utils.saveHtmlReport);
    });

    it('should save json report if json path is provided', () => {
        fs.readJsonSync.withArgs('foo').returns([{baz: 'quux'}]);
        fs.readJsonSync.withArgs('bar').returns([{asd: 'zxc'}]);
        mergeStatReports(['foo', 'bar'], {json: 'json-path'});

        assert.calledOnceWith(utils.saveJsonReport, 'json-path', [{baz: 'quux'}, {asd: 'zxc'}]);
    });

    it('should not save json report if json path is empty', () => {
        mergeStatReports([], {json: null});

        assert.notCalled(utils.saveJsonReport);
    });
});
