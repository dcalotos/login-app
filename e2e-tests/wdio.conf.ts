import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },
    
    specs: [
        './test/specs/**/*.ts'
    ],
    
    exclude: [
        './test/specs/mobile/**/*.ts'
    ],
    
    maxInstances: 5,
    
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1920,1080']
        },
        acceptInsecureCerts: true
    }],
    
    logLevel: 'info',
    
    bail: 0,
    
    baseUrl: process.env.BASE_URL || 'http://localhost:4200',
    
    waitforTimeout: 10000,
    
    connectionRetryTimeout: 120000,
    
    connectionRetryCount: 3,
    
    services: ['chromedriver'],
    
    framework: 'mocha',
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    /**
     * Gets executed once before all workers get launched.
     */
    onPrepare: function (config, capabilities) {
        console.log('Starting test execution...');
    },

    /**
     * Gets executed before a worker process is spawned.
     */
    onWorkerStart: function (cid, caps, specs, args, execArgv) {
        console.log(`Worker ${cid} started`);
    },

    /**
     * Gets executed after all tests are done.
     */
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('Test execution completed');
    },

    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await browser.takeScreenshot();
        }
    }
}
