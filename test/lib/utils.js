'use strict';

const fs = require('fs-extra');
const utils = require('../../lib/utils');

describe('lib/utils', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(fs, 'ensureDirSync');
        sandbox.stub(fs, 'writeJsonSync');
        sandbox.stub(fs, 'copySync');
    });

    afterEach(() => sandbox.restore());

    describe('humanizeDuration', () => {
        it('should transform duration into human readable format with minutes and seconds', () => {
            assert.equal(utils.humanizeDuration(61000), '01:01');
        });
    });

    describe('saveJsonReport', () => {
        it('should create parent folder for the given filePath', () => {
            utils.saveJsonReport('some-folder/file.html', 'some-content');

            assert.calledOnceWith(fs.ensureDirSync, sinon.match(/some-folder/));
        });

        it('should save json on file system for the given file path', () => {
            utils.saveJsonReport('some-folder/file.html', 'some-content');

            assert.calledOnceWith(fs.writeJsonSync, sinon.match(/some-folder\/file\.html$/), 'some-content');
        });

        it('should show an error if error occurred on saving file', () => {
            const err = new Error('some-error');
            sandbox.stub(console, 'error');
            fs.writeJsonSync.throws(err);

            utils.saveJsonReport('some-folder/file.html', 'some-content');

            assert.calledOnceWith(console.error, err);
        });
    });

    describe('saveHtmlReport', () => {
        beforeEach(() => {
            sandbox.stub(utils, 'saveJsonReport');
        });

        it('should call saveJsonReport function with given data', () => {
            utils.saveHtmlReport('some-folder', 'some-content');

            assert.calledOnceWith(utils.saveJsonReport, sinon.match(/some-folder\/report\.json$/), 'some-content');
        });

        it('should copy files from ./static/dist to the given folder', () => {
            utils.saveHtmlReport('some-folder', 'some-content');

            assert.calledOnceWith(fs.copySync, sinon.match(/\/static\/dist/), sinon.match(/some-folder/));
        });
    });
});
