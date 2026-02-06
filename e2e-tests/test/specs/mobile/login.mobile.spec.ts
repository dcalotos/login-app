import BasePage from '../../pageobjects/base.page';

describe('Mobile - Login Flow', () => {
    const basePage = new BasePage();

    it('should display login screen', async () => {
        // Mobile-specific selectors (adjust based on your mobile app)
        const usernameField = await $('~username-input');
        const passwordField = await $('~password-input');
        const loginButton = await $('~login-button');

        await expect(usernameField).toBeDisplayed();
        await expect(passwordField).toBeDisplayed();
        await expect(loginButton).toBeDisplayed();
    });

    it('should login successfully on mobile', async () => {
        const username = process.env.TEST_USERNAME || 'testuser';
        const password = process.env.TEST_PASSWORD || 'Test123!';

        // Mobile-specific selectors
        const usernameField = await $('~username-input');
        const passwordField = await $('~password-input');
        const loginButton = await $('~login-button');

        await usernameField.setValue(username);
        await passwordField.setValue(password);
        await loginButton.click();

        // Wait for dashboard screen
        const dashboardScreen = await $('~dashboard-screen');
        await dashboardScreen.waitForDisplayed({ timeout: 10000 });
        await expect(dashboardScreen).toBeDisplayed();
    });

    it('should show error for invalid credentials on mobile', async () => {
        const usernameField = await $('~username-input');
        const passwordField = await $('~password-input');
        const loginButton = await $('~login-button');

        await usernameField.setValue('invaliduser');
        await passwordField.setValue('invalidpass');
        await loginButton.click();

        const errorMessage = await $('~error-message');
        await errorMessage.waitForDisplayed({ timeout: 5000 });
        await expect(errorMessage).toBeDisplayed();
    });
});
