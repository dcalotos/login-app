import { config as baseConfig } from './wdio.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,
    
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    
    maxInstances: 5,
    
    capabilities: [
        {
            browserName: 'Chrome',
            'bstack:options': {
                os: 'Windows',
                osVersion: '11',
                browserVersion: 'latest',
                projectName: 'Login App E2E Tests',
                buildName: 'Login App - Chrome Windows',
                sessionName: 'Chrome Desktop Test',
                local: false,
                debug: true,
                networkLogs: true,
                consoleLogs: 'verbose'
            }
        },
        {
            browserName: 'Firefox',
            'bstack:options': {
                os: 'Windows',
                osVersion: '11',
                browserVersion: 'latest',
                projectName: 'Login App E2E Tests',
                buildName: 'Login App - Firefox Windows',
                sessionName: 'Firefox Desktop Test'
            }
        },
        {
            browserName: 'Safari',
            'bstack:options': {
                os: 'OS X',
                osVersion: 'Monterey',
                browserVersion: 'latest',
                projectName: 'Login App E2E Tests',
                buildName: 'Login App - Safari Mac',
                sessionName: 'Safari Desktop Test'
            }
        }
    ],
    
    services: [
        ['browserstack', {
            browserstackLocal: false,
            opts: {
                forceLocal: false
            }
        }]
    ],
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ]
};
