'use strict';

const config = require('../../lib/config');

describe('config', () => {
    afterEach(() => {
        /*eslint-disable */
        delete process.env.brostatit_enabled;
        delete process.env.brostatit_reporters_flat_enabled;
        delete process.env.brostatit_reporters_html_enabled;
        delete process.env.brostatit_reporters_html_path;
        /*eslint-enable */
    });

    describe('by default', () => {
        it('should be disabled', () => {
            assert.equal(config({}).enabled, false);
        });

        it('should have enabled flat reporter', () => {
            assert.equal(config({}).reporters.flat.enabled, true);
        });

        it('should have disabled html reporter', () => {
            assert.equal(config({}).reporters.html.enabled, false);
        });
    });

    describe('should enable plugin', () => {
        it('by given configuration', () => {
            assert.equal(config({enabled: true}).enabled, true);
        });

        it('by environment variable', () => {
            /*eslint-disable */
            process.env.brostatit_enabled = true;
            /*eslint-enable */

            assert.equal(config({}).enabled, true);
        });
    });

    describe('should disable flat reporter', () => {
        it('by configuration file', () => {
            const conf = config({
                reporters: {
                    flat: {
                        enabled: false
                    }
                }
            });

            assert.equal(conf.reporters.flat.enabled, false);
        });

        it('by environment variable', () => {
            /*eslint-disable */
            process.env.brostatit_reporters_flat_enabled = false;
            /*eslint-enable */

            assert.equal(config({}).reporters.flat.enabled, false);
        });
    });

    describe('should enable html reporter', () => {
        it('by configuration file', () => {
            const conf = config({
                reporters: {
                    html: {
                        enabled: true
                    }
                }
            });

            assert.equal(conf.reporters.html.enabled, true);
        });

        it('by environment variable', () => {
            /*eslint-disable */
            process.env.brostatit_reporters_html_enabled = true;
            /*eslint-enable */

            assert.equal(config({}).reporters.html.enabled, true);
        });
    });

    describe('should get html report file path', () => {
        it('from configuration file', () => {
            const conf = config({
                reporters: {
                    html: {
                        path: 'some/file/path.html'
                    }
                }
            });

            assert.equal(conf.reporters.html.path, 'some/file/path.html');
        });

        it('from environment variable', () => {
            /*eslint-disable */
            process.env.brostatit_reporters_html_path = 'some/file/path.html';
            /*eslint-enable */

            assert.equal(config({}).reporters.html.path, 'some/file/path.html');
        });
    });
});
