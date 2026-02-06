import { config as baseConfig } from './wdio.conf';
import type { Options } from '@wdio/types';

const platform = process.env.PLATFORM || 'android';

const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:platformVersion': '13.0',
    'appium:app': process.env.ANDROID_APP_PATH || './apps/app-debug.apk',
    'appium:appPackage': 'com.loginapp',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240
};

const iosCapabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 14',
    'appium:platformVersion': '16.0',
    'appium:app': process.env.IOS_APP_PATH || './apps/app.ipa',
    'appium:bundleId': 'com.loginapp',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240
};

export const config: Options.Testrunner = {
    ...baseConfig,
    
    port: 4723,
    
    specs: [
        './test/specs/mobile/**/*.ts'
    ],
    
    exclude: [],
    
    capabilities: [platform === 'ios' ? iosCapabilities : androidCapabilities],
    
    services: [
        ['appium', {
            command: 'appium',
            args: {
                address: 'localhost',
                port: 4723,
                relaxedSecurity: true
            },
            logPath: './logs/'
        }]
    ],
    
    waitforTimeout: 15000,
    
    connectionRetryTimeout: 180000,
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results-mobile',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ]
};
