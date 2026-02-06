/**
 * Base page object containing common methods and properties
 */
export default class BasePage {
    /**
     * Wait for element to be displayed
     */
    async waitForDisplayed(element: WebdriverIO.Element, timeout = 10000): Promise<void> {
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Wait for element to be clickable
     */
    async waitForClickable(element: WebdriverIO.Element, timeout = 10000): Promise<void> {
        await element.waitForClickable({ timeout });
    }

    /**
     * Click on element
     */
    async click(element: WebdriverIO.Element): Promise<void> {
        await this.waitForClickable(element);
        await element.click();
    }

    /**
     * Set value to input element
     */
    async setValue(element: WebdriverIO.Element, value: string): Promise<void> {
        await this.waitForDisplayed(element);
        await element.setValue(value);
    }

    /**
     * Get text from element
     */
    async getText(element: WebdriverIO.Element): Promise<string> {
        await this.waitForDisplayed(element);
        return await element.getText();
    }

    /**
     * Check if element is displayed
     */
    async isDisplayed(element: WebdriverIO.Element): Promise<boolean> {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Open a specific page
     */
    async open(path: string): Promise<void> {
        await browser.url(path);
    }

    /**
     * Get current URL
     */
    async getCurrentUrl(): Promise<string> {
        return await browser.getUrl();
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name: string): Promise<void> {
        await browser.saveScreenshot(`./screenshots/${name}.png`);
    }

    /**
     * Wait for page to load
     */
    async waitForPageLoad(timeout = 10000): Promise<void> {
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState === 'complete'),
            { timeout, timeoutMsg: 'Page did not load within timeout' }
        );
    }
}
