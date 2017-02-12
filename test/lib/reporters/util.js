'use strict';

const fs = require('fs-extra');
const util = require('../../../lib/reporters/util');

describe('lib/util', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    describe('humanizeDuration', () => {
        it('should transform duration into human readable format with minutes and seconds', () => {
            assert.equal(util.humanizeDuration(61000), '01:01');
        });
    });

    describe('saveFile', () => {
        beforeEach(() => {
            sandbox.stub(fs, 'ensureDirSync');
            sandbox.stub(fs, 'writeFileSync');
        });

        it('should create parent folder for given filePath', () => {
            util.saveFile('some-folder/file.html', 'some-content');

            assert.calledOnce(fs.ensureDirSync);
            assert.calledWithMatch(fs.ensureDirSync, /some-folder$/);
        });

        it('should save file on file system for given file path', () => {
            util.saveFile('some-folder/file.html', 'some-content');

            assert.calledOnce(fs.writeFileSync);
            assert.calledWith(fs.writeFileSync, sinon.match(/some-folder\/file\.html$/), 'some-content');
        });

        it('should show an error if error occurred on saving file', () => {
            const err = new Error('some-error');
            sandbox.stub(console, 'error');
            fs.writeFileSync.throws(err);

            util.saveFile('some-folder/file.html', 'some-content');

            assert.calledWith(console.error, err);
        });
    });
});
