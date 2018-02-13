'use strict';

const config = require('../../lib/config');

describe('config', () => {
    beforeEach(function() {
        this.oldArgv = process.argv;
    });

    afterEach(function() {
        process.argv = this.oldArgv;

        delete process.env['stat_reporter_enabled'];
        delete process.env['stat_reporter_reporters_flat_enabled'];
        delete process.env['stat_reporter_reporters_html_enabled'];
        delete process.env['stat_reporter_reporters_html_path'];
        delete process.env['stat_reporter_reporters_json_enabled'];
        delete process.env['stat_reporter_reporters_json_path'];
    });

    describe('by default', () => {
        it('should be enabled', () => {
            assert.isTrue(config({}).enabled);
        });

        it('should have enabled flat reporter', () => {
            assert.isTrue(config({}).reporters.flat.enabled);
        });

        it('should have disabled html reporter', () => {
            assert.isFalse(config({}).reporters.html.enabled);
        });

        it('should have disabled json reporter', () => {
            assert.isFalse(config({}).reporters.json.enabled);
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

            assert.isFalse(conf.reporters.flat.enabled);
        });

        it('by cli', () => {
            process.argv = process.argv.concat('--stat-reporter-reporters-flat-enabled', 'false');

            assert.isFalse(config({}).reporters.flat.enabled);
        });

        it('by environment variable', () => {
            process.env['stat_reporter_reporters_flat_enabled'] = 'false';

            assert.isFalse(config({}).reporters.flat.enabled);
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

        it('by cli', () => {
            process.argv = process.argv.concat('--stat-reporter-reporters-html-enabled', 'true');

            assert.isTrue(config({}).reporters.html.enabled);
        });

        it('by environment variable', () => {
            process.env['stat_reporter_reporters_html_enabled'] = 'true';

            assert.isTrue(config({}).reporters.html.enabled);
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

        it('from cli', () => {
            process.argv = process.argv.concat('--stat-reporter-reporters-html-path', 'new/path');

            assert.equal(config({}).reporters.html.path, 'new/path');
        });

        it('from environment variable', () => {
            process.env['stat_reporter_reporters_html_path'] = 'some/file/path.html';

            assert.equal(config({}).reporters.html.path, 'some/file/path.html');
        });
    });

    describe('should enable json reporter', () => {
        it('by configuration file', () => {
            const conf = config({
                reporters: {
                    json: {
                        enabled: true
                    }
                }
            });

            assert.equal(conf.reporters.json.enabled, true);
        });

        it('by cli', () => {
            process.argv = process.argv.concat('--stat-reporter-reporters-json-enabled', 'true');

            assert.isTrue(config({}).reporters.json.enabled);
        });

        it('by environment variable', () => {
            process.env['stat_reporter_reporters_json_enabled'] = 'true';

            assert.isTrue(config({}).reporters.json.enabled);
        });
    });

    describe('should get json report file path', () => {
        it('from configuration file', () => {
            const conf = config({
                reporters: {
                    json: {
                        path: 'some/file/path.json'
                    }
                }
            });

            assert.equal(conf.reporters.json.path, 'some/file/path.json');
        });

        it('from cli', () => {
            process.argv = process.argv.concat('--stat-reporter-reporters-json-path', 'new/path');

            assert.equal(config({}).reporters.json.path, 'new/path');
        });

        it('from environment variable', () => {
            process.env['stat_reporter_reporters_json_path'] = 'some/file/path.json';

            assert.equal(config({}).reporters.json.path, 'some/file/path.json');
        });
    });
});
