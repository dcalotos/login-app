import LoginPage from '../../pageobjects/login.page';
import DashboardPage from '../../pageobjects/dashboard.page';

describe('Dashboard Page', () => {
    beforeEach(async () => {
        // Login before each test
        await LoginPage.open();
        const username = process.env.TEST_USERNAME || 'testuser';
        const password = process.env.TEST_PASSWORD || 'Test123!';
        await LoginPage.login(username, password);
        
        // Wait for redirect to dashboard
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/dashboard'),
            {
                timeout: 10000,
                timeoutMsg: 'Expected to redirect to dashboard'
            }
        );
    });

    it('should display dashboard after login', async () => {
        await expect(DashboardPage.navbarBrand).toBeDisplayed();
        await expect(DashboardPage.cardTitle).toBeDisplayed();
        await expect(DashboardPage.userInfo).toBeDisplayed();
    });

    it('should display user information', async () => {
        const username = await DashboardPage.getNavbarUsername();
        await expect(username).toBeTruthy();
        
        const usernameInfo = await DashboardPage.getUserInfoValue('Username');
        await expect(usernameInfo).toBeTruthy();
        
        const emailInfo = await DashboardPage.getUserInfoValue('Email');
        await expect(emailInfo).toBeTruthy();
    });

    it('should display success message', async () => {
        const isSuccessDisplayed = await DashboardPage.isSuccessMessageDisplayed();
        await expect(isSuccessDisplayed).toBe(true);
    });

    it('should logout successfully', async () => {
        await DashboardPage.logout();
        
        // Should redirect to login page
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to redirect to login page after logout'
            }
        );
        
        await expect(LoginPage.inputUsername).toBeDisplayed();
    });

    it('should display account status', async () => {
        const accountStatus = await DashboardPage.getUserInfoValue('Account Status');
        await expect(accountStatus).toBeTruthy();
    });
});
